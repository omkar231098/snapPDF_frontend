import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';
import Header from './Header'
import Swal from 'sweetalert2';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
const Form = () => {
  // const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('address', address);
    formData.append('photo', photo);

    try {
        const response = await axios.post('https://tiny-cyan-slug-ring.cyclic.app/pdf/submit', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'arraybuffer', // Use 'arraybuffer' to handle binary data
        });
  
        // Save the generated PDF
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
        Swal.fire({
          icon: 'success',
          title: 'Form submitted successfully!',
          text: 'Your details have been saved.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Form submission failed!',
          text: 'An error occurred while saving your details.',
        });
        console.error(error);
      }
  };

  const handleDownload = () => {
    // Trigger download of the PDF
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${name}_preview.pdf`;
    a.click();
  };

  return (<>
  <Header/>
    <div style={{ display: 'flex', height: '85vh',marginTop:'10px' }}>
    {/* Form Section */}
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <form >
        <h1>Enter Your Details</h1>
        <input style={{ fontSize:"15px", fontFamily:'Kanit, sans-serif'}} type="text" name="name" onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" />
        <input style={{ fontSize:"15px", fontFamily:'Kanit, sans-serif'}} type="number" name="age" onChange={(e) => setAge(e.target.value)} value={age} placeholder="Age" />
        <input style={{ fontSize:"15px", fontFamily:'Kanit, sans-serif'}} type="text" name="address" onChange={(e) => setAddress(e.target.value)}  value={address} placeholder="Address" />
        <input style={{ fontSize:"15px", fontFamily:'Kanit, sans-serif'}} type="file"  onChange={handleFileChange} placeholder="Upload Photo" />
  
        <button onClick={handleSubmit} style={{ fontSize:"15px", fontFamily:'Kanit, sans-serif'}} type="submit">Save</button>
        {/* Add more form elements as needed */}
      </form>
    </div>
  
    {/* Vertical Line */}
    <div style={{ width: '1px', background: '#ccc' }}></div>
  
    {/* PDF Preview Section */}
    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center',  overflowY: 'auto' }}>
      {pdfUrl ? (
        // Display PDF preview if available
        <div style={{ textAlign: 'center' }}>
          <embed src={pdfUrl} width="100%" height="600" type="application/pdf" />
         
            <button onClick={handleDownload} style={{ marginTop: '10px', backgroundColor: 'rgb(244,0,0)', color: '#ffffff', padding: '10px', borderRadius: '5px', border: 'none' }}>Download PDF</button>
          
        </div>
      ) : (
        // Display a message if no file has been uploaded
        <div style={{ border: '2px dashed #007BFF', borderRadius: '5px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <p style={{ margin: 0 }}>No file uploaded yet. Upload a file to see the preview.</p>
        </div>
      )}
    </div>
  </div>
  </>
    
  );
};

export default Form;
