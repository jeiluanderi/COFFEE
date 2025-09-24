// import React from 'react';
// import coffeeHeaderBackground from '../../assets/img/coff.jpg';

// const PageHeader = ({ title, activePage }) => {
//     const backgroundStyle = {
//         backgroundImage: `url(${coffeeHeaderBackground})`,
//         backgroundSize: '200px auto',
//         backgroundPosition: 'center center',
//         backgroundAttachment: 'fixed',
//     };

//     const activeBreadcrumbColor = 'beige'; // A dark coffee brown for visibility and contrast

//     return (
//         <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style={backgroundStyle}>
//             <div className="container text-center py-5">
//                 <h1 className="display-3 text-white mb-4 animated slideInDown">{title}</h1>
//                 <nav aria-label="breadcrumb animated slideInDown">
//                     <ol className="breadcrumb justify-content-center mb-0">
//                         <li className="breadcrumb-item"><a href="#" className="text-beige">Home</a></li>
//                         <li className="breadcrumb-item"><a href="#" className="text-beige">Shop</a></li>
//                         <li className="breadcrumb-item active" aria-current="page" style={{ color: activeBreadcrumbColor, fontWeight: 'bold' }}>
//                             {activePage}
//                         </li>
//                     </ol>
//                 </nav>
//             </div>
//         </div>
//     );
// };

// export default PageHeader;