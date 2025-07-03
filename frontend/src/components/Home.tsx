import React, { useEffect, useState } from 'react';
import instance from '../api';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from './Pagination';

interface Product {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: string;
  brand: string;
  image: string;
  status: string;
}

interface Props {
  goToAddProduct: () => void;
  goToProductView: () => void;
  goToEditProduct: (id: string) => void;
}

const Home: React.FC<Props> = ({ goToAddProduct, goToProductView, goToEditProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchProducts = async (pageNum = 1,  keyword = '') => {
    try {
      const res = await instance.get(`/product/list?page=${pageNum}&search=${keyword}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      fetchProducts(1, search);
  };

  const [productss, setproducts] = useState<Product[]>([]);
  const [pagee, setpage] = useState(1);
  const [totalpages, settotalpages] = useState(1);
  const [searchh, setsearch] = useState('');
  const fetchproducts = async (pageNum = 1, keyword = '') => {
    try{
      const res = await instance.get(``);
      setproducts(res.data.products);
      settotalpages(res.data.totalpages);
      setpage(res.data.pagee);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };
  const handlesearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchproducts(1, search);
  };
  const handlestatus = async (id: string) => {
    try{
      const res = await instance.patch(``);
      toast.success(res.data.message);
      fetchproducts(pagee);
    } catch {
      toast.error('Failed to update status');
    }
  };
  const handledelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete?')) return;
    try{
      await instance.delete(``);
      toast.success('Deleted successfully');
      fetchproducts(pagee);
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handlelogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleStatus = async (id: string) => {
  try {
    const res = await instance.patch(`/product/status/${id}`);
    toast.success(res.data.message);
    fetchProducts(page);    
  } catch {
    toast.error('Failed to update status');
  }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete?')) return;
    try {
      await instance.delete(`/product/${id}`);
      toast.success('Deleted successfully');
      fetchProducts(page);
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
    <h2>Welcome to HomePage!.</h2>
    <h2>Product List</h2>
    <form onSubmit={handleSearch}>
      <input id="search"
        type="text"
        placeholder="Search by Product Name, Description or Brand."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit">🔍Search</button>
    </form>
    <button onClick={goToAddProduct}>+ Add Product</button>
    <button onClick={goToProductView}>View Products</button>
    <center><table border={1} cellPadding={5} cellSpacing={0}>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Product Description</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Product Image</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          {products.map((p) => (
          <tr key={p._id}>
            <td>{p.name}</td>
            <td>{p.description}</td>
            <td>{p.brand}</td>
            <td>₹{parseFloat(p.price).toLocaleString()}</td>              
            <td>
            {p.image && (<img src={`http://localhost:5000/uploads/${p.image}`} width={80} height={80} alt="product" /> )}
            </td>
            <td>"{p.status}" /
              <button onClick={() => handleStatus(p._id)}>
                {p.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </td>
            <td>
              <button onClick={() => goToEditProduct(p._id)}>Edit</button>
              <button onClick={() => handleDelete(p._id)}>Delete</button>
            </td>
            </tr>
            ))}
        </tbody>
    </table> </center>
    <Pagination total={totalPages} current={page} setCurrent={setPage} />
    <button onClick={handleLogout}>Logout</button>
    <Toaster />
    </div>
  );
};

export default Home;

