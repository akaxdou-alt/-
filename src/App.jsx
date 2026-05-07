import { useMemo, useState } from 'react';
import { AppShell } from './components/AppShell';
import { FirebaseSetupNotice } from './components/FirebaseSetupNotice';
import { hasFirebaseConfig } from './firebase';
import { useFirestoreCollection } from './hooks/useFirestoreCollection';
import { AdminPage } from './pages/AdminPage';
import { FridgePage } from './pages/FridgePage';
import { MenuPage } from './pages/MenuPage';
import { OrderPage } from './pages/OrderPage';

function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const dishesStore = useFirestoreCollection('dishes', 'category');
  const ordersStore = useFirestoreCollection('orders', 'name');
  const inventoryStore = useFirestoreCollection('inventory', 'name');

  const orderCount = useMemo(
    () => ordersStore.items.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [ordersStore.items],
  );

  if (!hasFirebaseConfig) {
    return <FirebaseSetupNotice />;
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} orderCount={orderCount}>
      {activeTab === 'menu' ? <MenuPage dishesStore={dishesStore} ordersStore={ordersStore} /> : null}
      {activeTab === 'order' ? <OrderPage ordersStore={ordersStore} /> : null}
      {activeTab === 'fridge' ? <FridgePage inventoryStore={inventoryStore} /> : null}
      {activeTab === 'admin' ? <AdminPage dishesStore={dishesStore} /> : null}
    </AppShell>
  );
}

export default App;
