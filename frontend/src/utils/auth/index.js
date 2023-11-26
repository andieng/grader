// import { useRouter } from "next/navigation";

// export const getTokenDuration = () => {
//   const storeExpirationDate = localStorage.getItem("expiration");
//   const expirationDate = new Date(storeExpirationDate);
//   const now = new Date();
//   const duration = expirationDate.getTime() - now.getTime();

//   return duration;
// };

// export const getAuthToken = () => {
//   const token = localStorage.getItem("accessToken");

//   if (!token) {
//     return null;
//   }

//   const tokenDuration = getTokenDuration();

//   if (tokenDuration < 0) return "EXPIRED";

//   return token;
// };

// export const tokenLoader = () => {
//   return getAuthToken();
// };

// export const checkAuthLoader = () => {
//   const token = getAuthToken();

//   if (!token) {
//     return router.push("/login");
//   }
//   return null;
// };
