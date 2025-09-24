// import React from 'react';
// import coffeeHeaderBackground from '../../assets/img/coffees.jpg'; // Assuming a suitable coffee-themed background image

// const PageHeader = () => {
//     const backgroundStyle = {
//         backgroundImage: `url(${coffeeHeaderBackground})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center center',
//         backgroundAttachment: 'fixed', // This creates the parallax effect
//     };

//     // Define the color for the active breadcrumb item (dark coffee brown)
//     const activeBreadcrumbColor = '#4A2C2A';

//     return (
//         <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style={backgroundStyle}>
//             <div className="container text-center py-5">
//                 {/* Main title for the Locations page */}
//                 <h1 className="display-3 text-white mb-4 animated slideInDown">Our Baristas</h1>
//                 <nav aria-label="breadcrumb animated slideInDown">
//                     <ol className="breadcrumb justify-content-center mb-0">
//                         <li className="breadcrumb-item"><a href="#" className="text-white">Home</a></li>
//                         <li className="breadcrumb-item"><a href="#" className="text-white">Shop</a></li> {/* Keeping 'Shop' as the intermediate category */}
//                         {/* Active breadcrumb item for 'Locations' with explicit styling */}
//                         <li className="breadcrumb-item active" aria-current="page" style={{ color: activeBreadcrumbColor, fontWeight: 'bold' }}>
//                             Baristas
//                         </li>
//                     </ol>
//                 </nav>
//             </div>
//         </div>
//     );
// };

// export default PageHeader;