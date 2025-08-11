import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
// General views
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import NotFound from "@/views/NotFound.vue"
import UnauthorizedCandidate from '@/views/UnauthorizedCandidate.vue'
import UnauthorizedRecruiter from '@/views/UnauthorizedRecruiter.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
// Recruiter views
import RecruiterDashboard from '@/views/Recruiter/Dashboard.vue'
import CandidateList from '@/views/Recruiter/CandidateList.vue'
import JobList from '@/views/Recruiter/JobList.vue'
import ApplicationList from '@/views/Recruiter/ApplicationList.vue'
import BulkOps from '../views/Recruiter/BulkOps.vue'
import BulkAssignCandidates from '../views/Recruiter/BulkAssignCandidates.vue'
import CandidateDetail from '../views/Recruiter/CandidateDetail.vue'
// Candidate views (lazy-loaded)
const CandidateDashboard = () => import('@/views/Candidate/CandidateDashboard.vue')
const MyApplications = () => import('@/views/Candidate/MyApplications.vue')
const MyInterviews = () => import('@/views/Candidate/MyInterviews.vue')
const ApplicationDetail = () => import('@/views/Candidate/ApplicationDetail.vue')
const CodingScreen = () => import('@/views/Candidate/CodingScreen.vue')
const InterviewPrecheck = () => import('@/views/Candidate/InterviewPrecheck.vue')
import ChangePassword from '../views/Candidate/ChangePassword.vue'

const generalRoutes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { requiresAuth: false, layout: 'Blank' }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false, layout: 'Blank' }
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: NotFound,
        meta: {
            layout: 'Blank'
        }
    },
    {
        path: '/unautorized',
        name: 'UnauthorizedCandidate',
        component: UnauthorizedCandidate,
        meta: {
            layout: 'CandidateInnerApp'
        }
    },
    {
        path: '/not-allowed',
        name: 'UnauthorizedRecruiter',
        component: UnauthorizedRecruiter,
        meta: {
            layout: 'RecruiterInnerApp'
        }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: {
            layout: 'Blank'
        }
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: {
            layout: 'Blank'
        }
    }

]

const recruiterRoutes = [
    {
        path: '/recruiter/dashboard',
        name: 'RecruiterDashboard',
        component: RecruiterDashboard,
        meta: { requiresAuth: true, layout: 'RecruiterInnerApp', isRecruiter: true }
    },
    {
        path: '/recruiter/candidates',
        name: 'CandidateList',
        component: CandidateList,
        meta: { requiresAuth: true, layout: 'RecruiterInnerApp', isRecruiter: true }
    },
    {
        path: '/recruiter/jobs',
        name: 'JobList',
        component: JobList,
        meta: { requiresAuth: true, layout: 'RecruiterInnerApp', isRecruiter: true }
    },
    {
        path: '/recruiter/applications',
        name: 'ApplicationList',
        component: ApplicationList,
        meta: { requiresAuth: true, layout: 'RecruiterInnerApp', isRecruiter: true }
    },
    {
        path: '/recruiter/bulk-ops',
        name: 'BulkOps',
        component: BulkOps,
        meta: { requiresAuth: true, layout: 'RecruiterInnerApp', isRecruiter: true }
    },
    {
        path: '/recruiter/bulk-assign-candidates',
        name: 'BulkAssignCandidates',
        component: BulkAssignCandidates,
        meta: { requiresAuth: true, layout: 'RecruiterInnerApp', isRecruiter: true }
    },
    {
        path: '/recruiter/candidate-details/:email',
        name: 'CandidateDetail',
        component: CandidateDetail,
        props: true,
        meta: { requiresAuth: true, layout: 'RecruiterInnerApp', isRecruiter: true }
    }
]

const candidateRoutes = [
    {
        path: '/candidate/dashboard',
        name: 'CandidateDashboard',
        component: CandidateDashboard,
        meta: { requiresAuth: true, layout: 'CandidateInnerApp', isRecruiter: false }
    },
    {
        path: '/candidate/my-applications',
        name: 'MyApplications',
        component: MyApplications,
        meta: { requiresAuth: true, layout: 'CandidateInnerApp', isRecruiter: false }
    },
    {
        path: '/candidate/application/:jobId',
        name: 'ApplicationDetail',
        component: ApplicationDetail,
        props: true,
        meta: { requiresAuth: true, layout: 'CandidateInnerApp', isRecruiter: false }
    },
    {
        path: '/candidate/my-interviews',
        name: 'MyInterviews',
        component: MyInterviews,
        meta: { requiresAuth: true, layout: 'CandidateInnerApp', isRecruiter: false }
    },
    {
        path: '/candidate/code-screening/:id',
        name: 'CodingScreen',
        component: CodingScreen,
        props: true,
        meta: { requiresAuth: true, layout: 'Blank', isRecruiter: false }
    },
    {
        path: '/candidate/settings',
        name: 'CandidateSettings',
        component: ChangePassword,
        meta: { requiresAuth: true, layout: 'CandidateInnerApp', isRecruiter: false }
    },
    {
        path: '/candidate/interview-precheck/:id',
        name: 'InterviewPrecheck',
        component: InterviewPrecheck,
        props: true,
        meta: { requiresAuth: true, layout: 'Blank', isRecruiter: false }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: [...generalRoutes, ...recruiterRoutes, ...candidateRoutes]
})
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth === true

    // Only call once per session
    if (requiresAuth && !authStore.isUserLoaded) {
        await authStore.getCurrentUser()
    }

    const role = authStore.authData?.user?.userType
    const isRecruiterRoute = to.meta.isRecruiter === true
    const isCandidateRoute = to.meta.isRecruiter === false

    // 🔐 Not authenticated but auth required
    if (requiresAuth && !role) {
        return next({ name: 'Login' })
    }

    // 🚫 Recruiter accessing candidate-only route
    if (role === 'RECRUITER' && isCandidateRoute) {
        return next({ name: 'UnauthorizedRecruiter' })
    }

    // 🚫 Candidate accessing recruiter-only route
    if (role === 'CANDIDATE' && isRecruiterRoute) {
        return next({ name: 'UnauthorizedCandidate' })
    }
    
    // ✅ Allow normal navigation
    return next()

    
})


export default router
