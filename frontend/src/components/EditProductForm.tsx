import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import instance from '../api';

interface Props {
  id: string;
  goHome: () => void;
}

const EditProductForm: React.FC<Props> = ({ id, goHome }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    brand: ''
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    instance.get(`/product/${id}`)
      .then(res => setForm({
        id: res.data.id,
        name: res.data.name,
        description: res.data.description,
        price: res.data.price,
        brand: res.data.brand
      }))
      .catch(() => toast.error('Failed to load product'));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setImage(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if (!validate()) return;

    const formData = new FormData();
    formData.append('id', form.id);
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('brand', form.brand);
    if (image) formData.append('image', image);

    try {
      await instance.put(`/product/${id}`, formData);
      toast.success('Product updated successfully!');
      goHome();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Product update failed');
    }
  };

  const validate = () => {
  const idRegex = /^\d{10}$/;
  const nameRegex = /^[a-zA-Z0-9 ]+$/;
  
    const existing = JSON.parse(localStorage.getItem('products') || '[]');
    if(existing.find((p:any) => p.id === form.id))
    {
      toast.error('Product Id must be unique');
      return false;
    } 
    if (!idRegex.test(form.id)) {
      toast.error('Product ID must be 10-digit number');
      return false;
    }
    if (!nameRegex.test(form.name)) {
      toast.error('Product name can only contain letters, numbers, spaces');
      return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit product</h2>
      <label id="id">Product id :</label>
      <input name="id" placeholder="Product ID" value={form.id} onChange={handleChange} required /><br/><br></br>

      <label id="name">Product Name :</label>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br/><br />

      <label id="description">Product desc :</label>
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required /><br/><br />

      <label id="price">Price :</label>
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required /><br/><br />

      <label id="brand">Brand :</label>
      <select name="brand" value={form.brand} onChange={handleChange} required>
        <option value="">Select Brand</option>
        <option value="Apple">Apple</option>
        <option value="Samsung">Samsung</option>
        <option value="Oppo">Oppo</option>
        <option value="OnePlus">Oneplus</option>
        <option value="Redmi">Redmi</option>
        <option value="Vivo">Vivo</option>
        <option value="Nothing">Nothing</option>
        <option value="Google">Google</option>
        <option value="Realme">Realme</option>
        <option value="Sony">Sony</option>
        <option value="Xioami">Xioami</option>
        <option value="Infinix">infinix</option>
      </select><br/><br />

      <label id="image">Product image :</label>
      <input type="file" name="image" accept="image/*" onChange={handleChange} /><br/><br />
      
      <button type="submit">Update Product</button>
      <button type="button" onClick={goHome}>Back</button>
      <Toaster />
    </form>
  );
};

export default EditProductForm;
