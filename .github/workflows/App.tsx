import React, { useState, useCallback } from 'react';
import type { Trip, Expense, Customer } from './types';
import { View } from './types';
import Dashboard from './components/Dashboard';
import Log from './components/Log';
import Analytics from './components/Analytics';
import Customers from './components/Customers';
import CustomerDetail from './components/CustomerDetail';
import AddEntryModal from './components/AddEntryModal';
import ConfirmModal from './components/ConfirmModal';
import { DashboardIcon, LogIcon, AnalyticsIcon, CustomersIcon, PlusIcon, CloseIcon, MotorcycleIcon, ExpenseIcon } from './components/icons';

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.Dashboard);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
    const [entryToEdit, setEntryToEdit] = useState<Trip | Expense | null>(null);
    const [initialFormType, setInitialFormType] = useState<'trip' | 'expense'>('trip');
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [trips, setTrips] = useState<Trip[]>(() => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(today.getDate() - 2);
        return [
            { id: 't1', customerName: 'آمنة', customerPhone: '111-222-3333', earnings: 15.50, date: today },
            { id: 't2', customerName: 'بدر', customerPhone: '222-333-4444', earnings: 22.00, date: today },
            { id: 't3', customerName: 'جاسم', customerPhone: '333-444-5555', earnings: 12.75, date: yesterday },
            { id: 't4', customerName: 'آمنة', customerPhone: '111-222-3333', earnings: 18.25, date: twoDaysAgo },
        ];
    });

    const [expenses, setExpenses] = useState<Expense[]>(() => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        return [
            { id: 'e1', description: 'وقود', amount: 30.00, date: today },
            { id: 'e2', description: 'غداء', amount: 12.50, date: yesterday },
        ];
    });

    const handleOpenAddModal = (type: 'trip' | 'expense') => {
        setEntryToEdit(null);
        setInitialFormType(type);
        setIsModalOpen(true);
        setIsQuickMenuOpen(false);
    };

    const handleOpenEditModal = (entry: Trip | Expense) => {
        setEntryToEdit(entry);
        setInitialFormType('earnings' in entry ? 'trip' : 'expense');
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEntryToEdit(null);
    };

    const addTrip = useCallback((trip: Omit<Trip, 'id' | 'date'>) => {
        setTrips(prev => [...prev, { ...trip, id: `t${Date.now()}`, date: new Date() }]);
    }, []);

    const addExpense = useCallback((expense: Omit<Expense, 'id' | 'date'>) => {
        setExpenses(prev => [...prev, { ...expense, id: `e${Date.now()}`, date: new Date() }]);
    }, []);
    
    const updateTrip = useCallback((updatedTrip: Trip) => {
        setTrips(prev => prev.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
    }, []);

    const updateExpense = useCallback((updatedExpense: Expense) => {
        setExpenses(prev => prev.map(expense => expense.id === updatedExpense.id ? updatedExpense : expense));
    }, []);
    
    const requestDeleteEntry = useCallback((id: string) => {
        setEntryToDelete(id);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (!entryToDelete) return;
        setTrips(prev => prev.filter(trip => trip.id !== entryToDelete));
        setExpenses(prev => prev.filter(expense => expense.id !== entryToDelete));
        setEntryToDelete(null);
    }, [entryToDelete]);
    
    const handleViewCustomerDetail = (customer: Customer) => {
        setSelectedCustomer(customer);
    };

    const handleBackToCustomerList = () => {
        setSelectedCustomer(null);
    };
    
    const changeView = (newView: View) => {
        setView(newView);
        setSelectedCustomer(null); // Reset customer detail when changing main view
    };


    const renderView = () => {
        switch (view) {
            case View.Dashboard:
                return <Dashboard trips={trips} expenses={expenses} />;
            case View.Log:
                return <Log trips={trips} expenses={expenses} onEdit={handleOpenEditModal} onDelete={requestDeleteEntry} />;
            case View.Analytics:
                return <Analytics trips={trips} expenses={expenses} />;
            case View.Customers:
                 return selectedCustomer ? (
                    <CustomerDetail 
                        customer={selectedCustomer} 
                        allTrips={trips} 
                        onBack={handleBackToCustomerList}
                    />
                ) : (
                    <Customers 
                        trips={trips} 
                        onCustomerClick={handleViewCustomerDetail}
                    />
                );
            default:
                return <Dashboard trips={trips} expenses={expenses} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
            <main className="flex-grow pb-24">
                {renderView()}
            </main>

            <div className="fixed bottom-24 left-6 right-auto z-40 flex flex-col items-center gap-3">
                {isQuickMenuOpen && (
                    <div className="flex flex-col gap-3">
                        <button onClick={() => handleOpenAddModal('trip')} className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg flex items-center gap-2 pr-4 transition-all" aria-label="إضافة توصيلة">
                            <span>توصيلة</span>
                            <MotorcycleIcon className="w-6 h-6" />
                        </button>
                         <button onClick={() => handleOpenAddModal('expense')} className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg flex items-center gap-2 pr-4 transition-all" aria-label="إضافة مصروف">
                            <span>مصروف</span>
                            <ExpenseIcon className="w-6 h-6" />
                        </button>
                    </div>
                )}
                 <button
                    onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110"
                    aria-label="فتح قائمة الإضافة"
                >
                    {isQuickMenuOpen ? <CloseIcon className="w-8 h-8"/> : <PlusIcon className="w-8 h-8" />}
                </button>
            </div>


            <footer className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 shadow-lg">
                <nav className="flex justify-around max-w-lg mx-auto">
                    <NavItem icon={<DashboardIcon className="w-6 h-6 mb-1" />} label="الرئيسية" isActive={view === View.Dashboard} onClick={() => changeView(View.Dashboard)} />
                    <NavItem icon={<LogIcon className="w-6 h-6 mb-1" />} label="السجل" isActive={view === View.Log} onClick={() => changeView(View.Log)} />
                    <NavItem icon={<AnalyticsIcon className="w-6 h-6 mb-1" />} label="التحليلات" isActive={view === View.Analytics} onClick={() => changeView(View.Analytics)} />
                    <NavItem icon={<CustomersIcon className="w-6 h-6 mb-1" />} label="العملاء" isActive={view === View.Customers} onClick={() => changeView(View.Customers)} />
                </nav>
            </footer>
            
            <AddEntryModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                addTrip={addTrip} 
                addExpense={addExpense}
                updateTrip={updateTrip}
                updateExpense={updateExpense}
                entryToEdit={entryToEdit}
                initialFormType={initialFormType}
            />
            <ConfirmModal
                isOpen={entryToDelete !== null}
                onClose={() => setEntryToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد الحذف"
                message="هل أنت متأكد من أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."
            />
        </div>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
    const activeClass = 'text-blue-400';
    const inactiveClass = 'text-slate-400 hover:text-white';
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center p-3 w-24 transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`}>
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};


export default App;