// import React from "react";

// export const RotatingHeader: React.FC = () => {
//     return (
//         <header className="w-full border-b border-[--color-vice-teal]/30 bg-transparent">
//             <div className="flex items-center justify-center gap-6 px-10 py-8">
//                 <img
//                     src="/Meshed_m.png"
//                     alt="Meshed"
//                     className="h-24 w-24 object-contain"
//                     draggable={false}
//                     onError={(e) => {
//                         const el = e.currentTarget;
//                         if (el.src.includes("/Meshed_m.png")) {
//                             el.src = "/meshed_m.png";
//                         } else if (el.src.includes("/meshed_m.png")) {
//                             el.src = "/meshed_M.png";
//                         } else {
//                             el.style.display = "none";
//                         }
//                     }}
//                 />
//                 <span className="text-6xl font-bold tracking-tight text-foreground">
//                     meshed
//                 </span>
//             </div>
//         </header>
//     );
// };