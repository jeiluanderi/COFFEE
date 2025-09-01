// import React from 'react';
// import menuImage1 from '../../assets/img/menu-espresso.jpg';
// import menuImage2 from '../../assets/img/menu-latte.jpg';
// import menuImage3 from '../../assets/img/menu-pastry.jpg';
// import menuImage4 from '../../assets/img/menu-sandwich.jpg';
// import menuImage5 from '../../assets/img/menu-beans.jpg';
// import menuImage6 from '../../assets/img/menu-merch.jpg';

// // Data for the menu items
// const projectsData = [
//     {
//         imageSrc: menuImage1,
//         title: 'Espresso',
//         filterClass: 'coffee',
//         delay: '0.1s',
//     },
//     {
//         imageSrc: menuImage2,
//         title: 'Signature Latte',
//         filterClass: 'coffee',
//         delay: '0.3s',
//     },
//     {
//         imageSrc: menuImage3,
//         title: 'Fresh Pastries',
//         filterClass: 'food',
//         delay: '0.5s',
//     },
//     {
//         imageSrc: menuImage4,
//         title: 'Gourmet Sandwiches',
//         filterClass: 'food',
//         delay: '0.1s',
//     },
//     {
//         imageSrc: menuImage5,
//         title: 'Artisan Coffee Beans',
//         filterClass: 'merch',
//         delay: '0.3s',
//     },
//     {
//         imageSrc: menuImage6,
//         title: 'Cafe Merchandise',
//         filterClass: 'merch',
//         delay: '0.5s',
//     },
// ];

// // Reusable Project Card Component
// const ProjectCard = ({ imageSrc, title, filterClass, delay }) => {
//     const cardImageStyle = {
//         width: '100%',
//         height: '300px', // Adjust this value to your desired image height
//         objectFit: 'cover'
//     };

//     return (
//         <div className={`col-lg-4 col-md-6 portfolio-item ${filterClass} wow fadeInUp`} data-wow-delay={delay}>
//             <div className="portfolio-inner rounded">
//                 <img className="img-fluid" src={imageSrc} alt={title} style={cardImageStyle} />
//                 <div className="portfolio-text">
//                     <h4 className="text-white mb-4">{title}</h4>
//                     <div className="d-flex">
//                         <a className="btn btn-lg-square rounded-circle mx-2" href={imageSrc} data-lightbox="portfolio">
//                             <i className="fa fa-eye"></i>
//                         </a>
//                         <a className="btn btn-lg-square rounded-circle mx-2" href="">
//                             <i className="fa fa-link"></i>
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Main Projects Section Component
// const ProjectsSection = () => {
//     return (
//         <div className="container-xxl py-5">
//             <div className="container">
//                 <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '500px' }}>
//                     <p className="fs-5 fw-bold text-primary">Our Menu</p>
//                     <h1 className="display-5 mb-5">Explore Our Delicious Offerings</h1>
//                 </div>
//                 <div className="row wow fadeInUp" data-wow-delay="0.3s">
//                     <div className="col-12 text-center">
//                         <ul className="list-inline rounded mb-5" id="portfolio-flters">
//                             <li className="mx-2 active" data-filter="*">All</li>
//                             <li className="mx-2" data-filter=".coffee">Coffee & Espresso</li>
//                             <li className="mx-2" data-filter=".food">Food & Pastries</li>
//                             <li className="mx-2" data-filter=".merch">Merchandise</li>
//                         </ul>
//                     </div>
//                 </div>
//                 <div className="row g-4 portfolio-container">
//                     {projectsData.map((project, index) => (
//                         <ProjectCard
//                             key={index}
//                             imageSrc={project.imageSrc}
//                             title={project.title}
//                             filterClass={project.filterClass}
//                             delay={project.delay}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProjectsSection;