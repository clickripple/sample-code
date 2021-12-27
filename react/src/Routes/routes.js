import DashboardPage from "../views/Dashboard/DashboardPage";
import UserPage from "../views/User/UserPage";
import TechnicianPage from "../views/User/TechnicianPage";
import UserHelpPage from "../views/User/UserHelpPage";
import BookingPage from "../views/User/BookingPage";
import PlatformPage from "../views/Device/PlatformPage";
import BrandPage from "../views/Device/BrandPage";
import ModalPage from "../views/Device/ModalPage";
import AboutPage from "../views/CMS/AboutPage";
import ReferralPage from "../views/CMS/ReferralPage";
import PrivacyPolicyPage from "../views/CMS/PrivacyPolicyPage";
import TermsPage from "../views/CMS/TermsPage";
import PaymentPage from "../views/CMS/PaymentPage";
import ZipIndex from "../views/Zip/ZipIndex";



import Dashboard from "@material-ui/icons/Dashboard";
import PersonIcon from '@material-ui/icons/Person';
import Technician from '@material-ui/icons/EmojiPeople';
import GroupIcon from '@material-ui/icons/Group';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PaymentIcon from '@material-ui/icons/Payment';
import Phone from '@material-ui/icons/PhonelinkSetup';
import InfoIcon from '@material-ui/icons/Info';
import PolicyIcon from '@material-ui/icons/Policy';
import NoteIcon from '@material-ui/icons/Note';
import Reports from "../views/Reports/Reports";
import Newsletter from "../views/Newsletter/Newsletter";
import Problems from "../views/CMS/Problems";
import TechSupport from "../views/CMS/TechSupport";
const dashboardRoutes = [
  // {
  //   path: "/dashboard",
  //   component: Dashboard,
  //   name: "Create Bills",
  //   icon: 'billing_icon'
  // },

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/user",
    name: "User",
    icon: PersonIcon,
    component: UserPage
  },

  {
    path: "/technician",
    name: "Technician",
    icon: Technician,
    component: TechnicianPage
  },

  {
    path: "/help-support",
    name: "User Support",
    icon: GroupIcon,
    component: UserHelpPage
  },
  {
    path: "/tech-support",
    name: "Technician Support",
    icon: GroupIcon,
    component: TechSupport
  },
  {
    path: "/bookings",
    name: "Bookings",
    icon: LibraryBooksIcon,
    component: BookingPage
  },

  {
    path: "/settings",
    name: "Settings",
    icon: MonetizationOnIcon,
    component: ReferralPage
  },
  {
    path: "/payment",
    name: "Payment",
    icon: PaymentIcon,
    component: PaymentPage
  },

  {
    // path: "/device-category",
    name: "Device Category",
    icon: Phone,
    parent: true,
    children: [
      {
        path: "/platform",
        name: "Platform",
        icon: Dashboard,
        component: PlatformPage
      },
      {
        path: "/brand",
        name: "Brand",
        icon: Dashboard,
        component: BrandPage
      },
      {
        path: "/model",
        name: "Model",
        icon: Dashboard,
        component: ModalPage
      }
    ]
  },

  {
    path: "/about",
    name: "About",
    icon: InfoIcon,
    component: AboutPage
  },

  {
    path: "/privacy_policy",
    name: "Privacy Policy",
    icon: PolicyIcon,
    component: PrivacyPolicyPage
  },
  {
    path: "/zip",
    name: "Zip Codes",
    icon: PolicyIcon,
    component: ZipIndex
  },
  {
    path: "/newsletter",
    name: "Newsletter",
    icon: PolicyIcon,
    component: Newsletter
  },
  {
    path: "/reports",
    name: "Reports",
    icon: PolicyIcon,
    component: Reports
  },
  {
    path: "/terms_conditions",
    name: "Terms & Condition",
    icon: NoteIcon,
    component: TermsPage
  },
  {
    path: "/problems",
    name: "Problem List",
    icon: NoteIcon,
    component: Problems
  },


  { redirect: true, path: "/", to: "/dashboard" }
];
export default dashboardRoutes;
