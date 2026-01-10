import Navbar from '../components/Navbar';
import CustomerForm from '../components/CustomerForm';
import CustomerTable from '../components/CustomerTable';
import { useCustomers } from '../hooks/useCustomers';

export default function DashboardPage() {
  const {
    customers,
    loading,
    error,
    addingCustomer,
    addCustomer,
    updateCustomerStatus,
    deleteCustomer,
  } = useCustomers();

  async function handleAddCustomer(formData) {
    try {
      await addCustomer(formData);
    } catch (err) {
      alert('Failed to add customer. Please try again.');
    }
  }

  async function handleUpdateStatus(customerId, newStatus) {
    try {
      await updateCustomerStatus(customerId, newStatus);
    } catch (err) {
      alert('Failed to update status. Please try again.');
    }
  }

  async function handleDeleteCustomer(customerId) {
    try {
      await deleteCustomer(customerId);
    } catch (err) {
      alert('Failed to delete customer. Please try again.');
    }
  }

  return (
    <div className="dashboard">
      <Navbar />
      <main className="main-content">
        {error && <div className="error-banner">{error}</div>}
        
        <div className="grid">
          <CustomerForm onSubmit={handleAddCustomer} loading={addingCustomer} />
          
          {loading ? (
            <section className="card">
              <h3>All Submissions</h3>
              <div className="loading">Loading...</div>
            </section>
          ) : (
            <CustomerTable
              customers={customers}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteCustomer}
            />
          )}
        </div>
      </main>
    </div>
  );
}
