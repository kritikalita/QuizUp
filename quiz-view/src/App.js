import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import TopNavBar from './TopNavBar';
import ChatList from './ChatList';

// --- Placeholder Icons ---
const UserPlaceholderIcon = () => (
    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
);
const TopicPlaceholderIcon = () => (
    <svg className="w-8 h-8 text-indigo-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l-.707-.707M12 21v-1m6.364-1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M12 6a3 3 0 100-6 3 3 0 000 6z"></path></svg>
);
const TopicDetailPlaceholderIcon = () => (
    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l-.707-.707M12 21v-1m6.364-1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M12 6a3 3 0 100-6 3 3 0 000 6z"></path></svg>
);
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
        <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 inline text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M11.99 2.05c.53-.02 1.07.1 1.53.39l.74.46c.46.29.99.46 1.53.51h.04c.54.05 1.07.22 1.53.49l.76.47c.71.44 1.05 1.35.79 2.14l-.26.79c-.16.5-.19 1.04-.09 1.56l.16.82c.26.86-.06 1.8-.79 2.3l-.5.34c-.45.3-.8.7-.99 1.17l-.23.63c-.32.86-1.2 1.4-2.13 1.4h-.05c-.5 0-1-.15-1.42-.42l-.69-.45c-.45-.29-.98-.45-1.53-.49h-.03c-.54-.05-1.07-.22-1.53-.49l-.7-.44c-.72-.45-1.05-1.37-.79-2.16l.26-.8c-.16.5-.19 1.04-.09 1.56l.16.82c.26.86-.06 1.8-.79 2.3l-.5.34c-.45.3-.8.7-.99 1.17l-.23.63c-.32.86-1.2 1.4-2.13 1.4h-.04c-.5 0-1-.15-1.42-.42l-.69-.45z" /></svg>;

// --- Icons for Topic Detail ---
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const RankingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>;

// --- NEW Icons for Profile Page (matching screenshot) ---
const PlayButtonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const UserMinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM19 11a1 1 0 00-1-1h-4a1 1 0 100 2h4a1 1 0 001-1z" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9z" clipRule="evenodd" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;

// --- Achievement Icons ---
const FirstQuizIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>;
const PerfectScoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const JavaExpertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>;
const SocialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a6 6 0 00-12 0v3h12z" /></svg>;
const VeteranIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v1a1 1 0 001 1h12a1 1 0 001-1V6h1a1 1 0 100-2h-1V3a1 1 0 00-1-1H5zM4 9a1 1 0 00-1 1v7a1 1 0 001 1h12a1 1 0 001-1v-7a1 1 0 00-1-1H4z" clipRule="evenodd" /></svg>;

// --- Achievement Details Map ---
// Added positioning for the new profile view
const ACHIEVEMENT_DETAILS = {
    "FIRST_QUIZ": { name: "First Step", description: "Completed your first quiz!", icon: <FirstQuizIcon />, color: "bg-green-400", text: "text-white", position: "top-0 -left-1" },
    "QUIZ_VETERAN": { name: "Quiz Veteran", description: "Completed 10 quizzes!", icon: <VeteranIcon />, color: "bg-blue-400", text: "text-white", position: "top-0 -right-1" },
    "PERFECT_SCORE": { name: "Perfectionist", description: "Achieved a 100% score on a quiz!", icon: <PerfectScoreIcon />, color: "bg-yellow-400", text: "text-white", position: "bottom-0 -left-1" },
    "JAVA_NOVICE": { name: "Java Novice", description: "Completed your first Java quiz!", icon: <JavaExpertIcon />, color: "bg-orange-400", text: "text-white", position: "bottom-0 -right-1" },
    "JAVA_EXPERT": { name: "Java Expert", description: "Scored 90%+ on a Java quiz!", icon: <JavaExpertIcon />, color: "bg-red-500", text: "text-white", position: "top-0 -left-1" },
    "SOCIAL_BUTTERFLY": { name: "Social Butterfly", description: "Followed 5 users!", icon: <SocialIcon />, color: "bg-cyan-400", text: "text-white", position: "top-0 -right-1" },
};

// --- XP & Leveling Helper ---
const xpFormulas = {
    calculateXpForLevel: (level) => {
        if (level <= 1) return 0;
        return Math.floor(100 * Math.pow(level - 1, 1.5));
    }
};

// --- Axios Setup ---
const getAuthToken = () => localStorage.getItem('token');
const api = axios.create({ baseURL: '/' });
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Main App Component ---
function App() {
    // --- State Variables ---
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);

    const [quizState, setQuizState] = useState('dashboard');

    const [myProfileData, setMyProfileData] = useState(null);
    const [publicProfileData, setPublicProfileData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showFollowersList, setShowFollowersList] = useState(false);
    const [showFollowingList, setShowFollowingList] = useState(false);

    // Chat State
    const [stompClient, setStompClient] = useState(null);
    const [isChatConnected, setIsChatConnected] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [activeChatUser, setActiveChatUser] = useState(null);
    const [chatMessages, setChatMessages] = useState({});
    const [chatInput, setChatInput] = useState('');
    const chatMessagesEndRef = useRef(null);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const [showChatList, setShowChatList] = useState(false);

    // Leaderboard State
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

    // Toast State
    const [newAchievementToast, setNewAchievementToast] = useState([]);
    const [newTitleToast, setNewTitleToast] = useState([]);

    // General UI State
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);


    // --- API Error Handler ---
    const handleApiError = useCallback((err, defaultMessage) => {
        console.error("API Error:", err);
        let specificError = defaultMessage || 'An unexpected error occurred.';
        if (err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
                specificError = 'Your session has expired. Please log in again.';
                localStorage.removeItem('token'); setIsAuthenticated(false); setLoggedInUsername('');
                setQuizState('dashboard');
                if (stompClient?.active) { try { stompClient.deactivate(); } catch (e) { console.error("Stomp deactivate error:", e); } setStompClient(null); setIsChatConnected(false); }
                setMyProfileData(null); setPublicProfileData(null); setChatMessages({}); setActiveChatUser(null); setShowChat(false);
            } else if (err.response.data && typeof err.response.data === 'string') { specificError = err.response.data; }
        } else if (err.message) { specificError = err.message; }

        if (!defaultMessage?.toLowerCase().includes('leaderboard')) {
            setError(specificError);
        } else {
            console.error("Leaderboard specific error:", specificError);
        }
        setIsLoading(false); setIsLoadingProfile(false); setIsLoadingTopics(false); setIsSubmitting(false); setIsLoadingLeaderboard(false);
    }, [stompClient]);

    // --- Logout Handler ---
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token'); setIsAuthenticated(false); setLoggedInUsername('');
        setTopics([]); setQuestions([]); setSelectedTopic(null); setQuizResult(null);
        setMyProfileData(null); setPublicProfileData(null); setSearchQuery(''); setSearchResults([]);
        setQuizState('dashboard'); setShowFollowersList(false); setShowFollowingList(false); setActiveChatUser(null);
        setChatMessages({});
        setShowChat(false);
        setShowChatList(false);
        setError(null);
        setMessage(null);
        setUnreadMessagesCount(0);
        setSelectedTopic(null);
        setLeaderboard([]);
        if (stompClient?.active) { try { stompClient.deactivate(); } catch (e) { console.error("Stomp deactivate error:", e); } setStompClient(null); setIsChatConnected(false); console.log("WS Disconnected on logout"); }
    }, [stompClient]);

    // --- Data Fetching Functions ---
    const fetchTopics = useCallback(async () => {
        setIsLoadingTopics(true); setError(null);
        try { const response = await api.get('/api/quiz/topics'); setTopics(response.data || []); }
        catch (err) { handleApiError(err, 'Failed to load topics.'); setTopics([]); }
        finally { setIsLoadingTopics(false); }
    }, [handleApiError]);

    const fetchMyProfile = useCallback(async () => {
        setIsLoadingProfile(true); setError(null);
        try { const response = await api.get('/api/profile/me'); setMyProfileData(response.data); }
        catch (err) { handleApiError(err, 'Failed to load your profile.'); setMyProfileData(null); }
        finally { setIsLoadingProfile(false); }
    }, [handleApiError]);

    const fetchPublicProfile = useCallback(async (usernameToFetch) => {
        setIsLoadingProfile(true); setError(null); setPublicProfileData(null); setQuizState('public_profile');
        setShowChat(false);
        setShowChatList(false);
        setActiveChatUser(null);
        try { const response = await api.get(`/api/profile/${usernameToFetch}`); setPublicProfileData(response.data); }
        catch (err) { handleApiError(err, `Could not find profile for ${usernameToFetch}.`); setQuizState('search'); }
        finally { setIsLoadingProfile(false); }
    }, [handleApiError]);

    const fetchLeaderboard = useCallback(async (topicName) => {
        if (!topicName) {
            setLeaderboard([]);
            return;
        }
        setIsLoadingLeaderboard(true);
        try {
            const response = await api.get(`/api/quiz/leaderboard/${encodeURIComponent(topicName)}?limit=10`);
            setLeaderboard(response.data || []);
        } catch (err) {
            console.error("Failed to load leaderboard for topic:", topicName, err);
            handleApiError(err, `Could not load leaderboard for ${topicName}.`);
            setLeaderboard([]);
        } finally {
            setIsLoadingLeaderboard(false);
        }
    }, [handleApiError]);


    // --- Message Handling ---
    const onMessageReceived = useCallback((payload) => {
        try {
            const message = JSON.parse(payload.body);
            const chatPartner = message.sender === loggedInUsername ? message.recipient : message.sender;
            if (!chatPartner) return;
            setChatMessages(prev => {
                const partnerMessages = prev[chatPartner] || [];
                if (partnerMessages.length > 0) {
                    const lastMsg = partnerMessages[partnerMessages.length - 1];
                    if (lastMsg.content === message.content && lastMsg.sender === message.sender && lastMsg.recipient === message.recipient && Math.abs(Date.now() - (lastMsg.timestamp || 0)) < 1000) {
                        return prev;
                    }
                }
                const newMessageWithTimestamp = { ...message, timestamp: Date.now() };
                const newMessages = { ...prev, [chatPartner]: [...partnerMessages, newMessageWithTimestamp] };

                if (!showChat || activeChatUser !== chatPartner) {
                    setUnreadMessagesCount(prevCount => prevCount + 1);
                }
                return newMessages;
            });
        } catch (e) { console.error("Could not parse received JSON message:", payload.body, e); }
    }, [loggedInUsername, showChat, activeChatUser]);

    // --- Chat Connection ---
    const connectChat = useCallback(() => {
        if (stompClient?.active || !loggedInUsername) return;
        const token = getAuthToken(); if (!token) { handleLogout(); return; } console.log("Connecting chat...");
        const client = new Client({
            webSocketFactory: () => new SockJS('/ws'), connectHeaders: { Authorization: `Bearer ${token}` }, debug: (str) => { /* console.log('STOMP: ' + str); */ }, reconnectDelay: 5000, heartbeatIncoming: 4000, heartbeatOutgoing: 4000,
            onConnect: (frame) => {
                console.log('WS Connected:', frame);
                setIsChatConnected(true);
                client.subscribe(`/user/${loggedInUsername}/queue/private`, onMessageReceived, { id: 'private-sub' });
                setError(null);
            },
            onStompError: (frame) => { console.error('Broker error:', frame.headers['message'], frame.body); setError('Chat connection error.'); setIsChatConnected(false); },
            onWebSocketError: (event) => { console.error('WebSocket Error', event); setError(!navigator.onLine ? 'Chat offline.' : 'Chat failed. Reconnecting...'); setIsChatConnected(false); },
            onDisconnect: () => {
                console.log("WS Disconnected");
                setIsChatConnected(false);
            }
        });
        client.activate(); setStompClient(client);
    }, [loggedInUsername, stompClient?.active, onMessageReceived, handleLogout]);

    // --- Main useEffect ---
    useEffect(() => {
        if (isAuthenticated && !loggedInUsername) {
            try { const token = getAuthToken(); if (token) { const payload = JSON.parse(atob(token.split('.')[1])); setLoggedInUsername(payload.sub); } else { handleLogout(); return; } }
            catch (e) { console.error("Token error:", e); handleLogout(); return; }
        }
        if (!isAuthenticated) { if (stompClient?.active) { try { stompClient.deactivate(); } catch (e) { } setStompClient(null); setIsChatConnected(false); } return; };
        if (isAuthenticated && loggedInUsername && !stompClient?.active && !stompClient) connectChat();

        if (quizState === 'dashboard') {
            if (!myProfileData) fetchMyProfile();
            if (topics.length === 0) fetchTopics();
            if (selectedTopic) setSelectedTopic(null);
            if (leaderboard.length > 0) setLeaderboard([]);
        } else if (quizState === 'topic_detail' && selectedTopic) {
            fetchLeaderboard(selectedTopic);
        } else if (quizState !== 'in_progress' && quizState !== 'finished') {
            if (questions.length > 0) setQuestions([]);
        }
    }, [isAuthenticated, quizState, loggedInUsername, connectChat, fetchTopics, fetchMyProfile, handleLogout, stompClient, myProfileData, topics.length, selectedTopic, fetchLeaderboard, questions.length, leaderboard.length]);


    // Auto-scroll chat
    useEffect(() => { if (showChat && activeChatUser) chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, showChat, activeChatUser]);

    // Reset unread count when chat is opened
    useEffect(() => {
        if (showChat && activeChatUser) {
            setUnreadMessagesCount(0);
        }
    }, [showChat, activeChatUser]);

    // useEffect for Achievement Toast
    useEffect(() => {
        if (newAchievementToast.length > 0) {
            const timer = setTimeout(() => {
                setNewAchievementToast([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [newAchievementToast]);

    // useEffect for Title Toast
    useEffect(() => {
        if (newTitleToast.length > 0) {
            const timer = setTimeout(() => {
                setNewTitleToast([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [newTitleToast]);

    // --- Auth Handlers ---
    const handleLogin = async (e) => {
        e.preventDefault(); setIsLoading(true); setError(null); setMessage(null);
        try {
            const response = await api.post('/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token); setLoggedInUsername(response.data.username); setIsAuthenticated(true);
            setQuizState('dashboard'); setUsername(''); setPassword('');
        } catch (err) { setError('Invalid username or password.'); localStorage.removeItem('token'); setIsAuthenticated(false); setLoggedInUsername(''); }
        finally { setIsLoading(false); }
    };
    const handleRegister = async (e) => {
        e.preventDefault(); if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        setIsLoading(true); setError(null); setMessage(null);
        try { await api.post('/api/auth/register', { username, password }); setMessage('Registration successful! Please log in.'); setIsLoginView(true); setUsername(''); setPassword(''); }
        catch (err) { handleApiError(err, 'Registration failed. Username might be taken.'); } finally { setIsLoading(false); }
    };

    // --- Quiz Handlers ---
    const startQuiz = async (topicNameToStart) => {
        setIsLoading(true); setError(null); setQuizResult(null);
        setShowChat(false); setShowChatList(false); setActiveChatUser(null);
        try {
            const response = await api.get(`/api/quiz/topic/${encodeURIComponent(topicNameToStart)}`);
            if (!response.data || response.data.length === 0) {
                setError(`No questions available for ${topicNameToStart || 'General'}.`);
                setQuizState('topic_detail');
                return;
            }
            setQuestions(response.data);
            setQuizState('in_progress');
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
        } catch (err) {
            handleApiError(err, `Failed to load quiz for ${topicNameToStart || 'General'}.`);
            setQuizState('topic_detail');
        } finally {
            setIsLoading(false);
        }
    };
    const backToDashboard = () => {
        setShowChat(false); setShowChatList(false); setActiveChatUser(null);
        setQuizState('dashboard');
        setQuestions([]); setQuizResult(null); setPublicProfileData(null); setSearchQuery(''); setSearchResults([]); setError(null); setShowFollowersList(false); setShowFollowingList(false);
    };
    const backToTopicDetail = () => {
        setQuizState('topic_detail');
        setQuestions([]);
        setQuizResult(null);
    };
    const handleSubmit = useCallback(async () => {
        setIsLoading(true); setError(null);
        const submittedTopic = questions.length > 0 ? (questions[0]?.topic || selectedTopic || "Unknown") : (selectedTopic || "Unknown");
        try {
            const response = await api.post('/api/quiz/submit', selectedAnswers);
            const resultData = response.data;

            setQuizResult({ ...resultData, topic: submittedTopic });
            setQuizState('finished');
            setShowChat(false); setShowChatList(false); setActiveChatUser(null);
            fetchMyProfile();

            if (resultData.newAchievements && resultData.newAchievements.length > 0) {
                setNewAchievementToast(resultData.newAchievements);
            }
            if (resultData.newTitles && resultData.newTitles.length > 0) {
                setNewTitleToast(resultData.newTitles);
            }

        }
        catch (err) { handleApiError(err, 'Failed to submit answers.'); } finally { setIsLoading(false); }
    }, [questions, selectedTopic, selectedAnswers, fetchMyProfile, handleApiError]);

    const handleAnswerSelect = (option) => { if (!questions || questions.length === 0) return; const q = questions[currentQuestionIndex]; if (q) setSelectedAnswers(prev => ({ ...prev, [q.id]: option })); };
    const handleNext = () => { if (questions && currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1); };
    const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev + 1); };

    // --- Social Handlers ---
    const handleSearch = useCallback(async (e) => {
        e.preventDefault(); if (!searchQuery.trim()) return; setIsLoading(true); setError(null);
        setShowChat(false); setShowChatList(false); setActiveChatUser(null);
        try { const response = await api.get(`/api/profile/search?query=${searchQuery.trim()}`); setSearchResults(response.data.filter(user => user.username !== loggedInUsername)); }
        catch (err) { handleApiError(err, 'Search failed.'); } finally { setIsLoading(false); }
    }, [handleApiError, searchQuery, loggedInUsername]);

    const handleFollow = useCallback(async (usernameToFollow) => {
        setIsSubmitting(true);
        try {
            await api.post(`/api/follow/${usernameToFollow}`);
            setPublicProfileData(prev => (prev ? { ...prev, isFollowedByCurrentUser: true, followersCount: (prev.followersCount ?? 0) + 1 } : null));
            fetchMyProfile();
        }
        catch (err) { handleApiError(err, 'Failed to follow.'); } finally { setIsSubmitting(false); }
    }, [handleApiError, fetchMyProfile]);

    const handleUnfollow = useCallback(async (usernameToUnfollow) => {
        setIsSubmitting(true);
        try {
            await api.delete(`/api/follow/${usernameToUnfollow}`);
            setPublicProfileData(prev => (prev ? { ...prev, isFollowedByCurrentUser: false, followersCount: Math.max(0, (prev.followersCount ?? 0) - 1) } : null));
            fetchMyProfile();
        }
        catch (err) { handleApiError(err, 'Failed to unfollow.'); } finally { setIsSubmitting(false); }
    }, [handleApiError, fetchMyProfile]);

    // --- Chat Sender ---
    const sendChatMessage = (e) => {
        e.preventDefault(); const content = chatInput.trim(); if (!content || !stompClient?.active || !isChatConnected || !activeChatUser) return;
        const chatMessage = { sender: loggedInUsername, recipient: activeChatUser, content, type: 'CHAT' };
        try { stompClient.publish({ destination: `/app/private.chat/${activeChatUser}`, body: JSON.stringify(chatMessage) }); setChatMessages(prev => ({ ...prev, [activeChatUser]: [...(prev[activeChatUser] || []), chatMessage] })); setChatInput(''); }
        catch (err) { console.error("Send fail:", err); setError("Failed to send message."); }
    };

    // --- Profile Pic Upload Handler ---
    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setUploadError("File is too large. Max 5MB."); return; }
        if (!['image/png', 'image/jpeg'].includes(file.type)) { setUploadError("Invalid file type. Only PNG or JPG."); return; }
        setUploadError(null); setMessage(null); setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await api.post('/api/profile/me/picture', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMyProfileData(prev => ({ ...prev, profilePictureUrl: response.data.profilePictureUrl }));
            setMessage("Profile picture updated!");
        } catch (err) {
            handleApiError(err, 'Failed to upload picture.');
            setUploadError('Failed to upload picture.');
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = null;
        }
    }, [handleApiError, fileInputRef]);

    // --- Derive chat partners from chatMessages ---
    const chatPartners = useMemo(() => {
        return Object.keys(chatMessages).sort();
    }, [chatMessages]);

    // --- Handler for selecting a user from the ChatList ---
    const handleUserSelectFromList = (username) => {
        setActiveChatUser(username);
        setShowChatList(false);
        setShowChat(true);
        setUnreadMessagesCount(0);
    };

    // --- Handler for toggling the ChatList visibility ---
    const toggleChatList = () => {
        setShowChatList(prev => !prev);
        if (!showChatList) {
            setShowChat(false);
            setActiveChatUser(null);
        }
    };


    // --- RENDER FUNCTIONS ---

    // --- Helper for rendering achievements ---
    // This helper is now simpler, just for the toast
    const renderAchievementBadges = (achievementCodes) => {
        if (!achievementCodes || achievementCodes.length === 0) {
            return <p className="text-sm text-gray-500 text-center py-2">No achievements yet.</p>;
        }

        return (
            <div className="flex flex-wrap gap-3 justify-center">
                {achievementCodes.map(code => {
                    const details = ACHIEVEMENT_DETAILS[code];
                    if (!details) return null;

                    return (
                        <div
                            key={code}
                            className={`flex items-center p-2 rounded-lg border shadow-sm ${details.color} ${details.text.replace('text-', 'border-')}`}
                            title={`${details.name}: ${details.description}`}
                        >
                            <span className={details.text}>{React.cloneElement(details.icon, { className: "h-6 w-6" })}</span>
                            <span className={`ml-2 text-sm font-semibold ${details.text}`}>{details.name}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // --- renderDashboard (My Profile) ---
    // Kept the original dashboard layout for "My Profile"
    const renderDashboard = () => {
        const profile = myProfileData;
        const displayAverageScore = typeof profile?.averageScore === 'number' ? profile.averageScore.toFixed(1) : 'N/A';
        const averageScoreValue = typeof profile?.averageScore === 'number' ? profile.averageScore : 0;

        const renderFollowList = (listTitle, listItems, emptyMessage) => (
            <div className="w-full animate-fade-in">
                <button onClick={() => { setShowFollowersList(false); setShowFollowingList(false); }} className="absolute top-20 left-4 text-primary hover:text-primary-dark font-medium z-10 focus:outline-none flex items-center">&larr; Back to Dashboard</button>
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center pt-8">{listTitle}</h1>
                <div className="bg-white rounded-lg shadow-md p-4 space-y-3 max-h-96 overflow-y-auto border border-gray-200">{listItems && listItems.length > 0 ? (listItems.map(user => (<div key={user.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"><span className="text-gray-700 font-medium capitalize">{user.username}</span>{(loggedInUsername !== user.username) && <button onClick={() => { setShowFollowersList(false); setShowFollowingList(false); fetchPublicProfile(user.username); }} className="text-xs text-primary hover:text-primary-dark font-semibold px-3 py-1 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors">View</button>}</div>))) : (<p className="text-gray-500 text-sm text-center py-4">{emptyMessage}</p>)}</div>
                <button onClick={() => { setShowFollowersList(false); setShowFollowingList(false); }} className="w-full mt-6 px-8 py-2.5 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">Close</button>
            </div>
        );

        if (showFollowersList) return renderFollowList(`Followers (${profile?.followersCount ?? 0})`, profile?.followers, "Not followed by anyone yet.");
        if (showFollowingList) return renderFollowList(`Following (${profile?.followingCount ?? 0})`, profile?.following, "Not following anyone yet.");

        return (
            <div className="w-full space-y-8 animate-fade-in">
                {/* Profile Header */}
                <div className="relative text-center pb-8 mb-8 pt-4">
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-red-100 via-white to-white opacity-60 z-0 rounded-t-lg"></div>
                    <div className="relative inline-block mb-3 z-10 -mt-16">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg"
                            style={{ display: 'none' }}
                            id="profilePicInput"
                            disabled={isLoading}
                        />
                        <label htmlFor="profilePicInput" className="cursor-pointer group relative block">
                            {profile && profile.profilePictureUrl ? (
                                <img
                                    src={profile.profilePictureUrl}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full bg-gray-200 mx-auto border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                    <UserPlaceholderIcon />
                                </div>
                            )}
                            <div className="absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200">
                                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                        </label>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 capitalize relative z-10">{loggedInUsername || 'User'}</h1>
                    <p className="text-sm text-gray-500 relative z-10">Quiz Enthusiast</p>
                    {uploadError && <p className="text-red-600 text-xs text-center mt-2">{uploadError}</p>}
                    {/* Stats */}
                    {isLoadingProfile ? (<LoadingSpinner />)
                        : profile ? (
                            <div className="mt-5 grid grid-cols-3 gap-4 relative z-10 max-w-sm mx-auto">
                                <div className="text-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                                    <p className="text-2xl font-semibold text-gray-800">{profile.totalQuizzesTaken ?? 0}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Quizzes</p>
                                </div>
                                <button onClick={() => setShowFollowersList(true)} disabled={!(profile.followersCount > 0)} className="text-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                    <p className="text-2xl font-semibold text-gray-800">{profile.followersCount ?? 0}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Followers</p>
                                </button>
                                <button onClick={() => setShowFollowingList(true)} disabled={!(profile.followingCount > 0)} className="text-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                    <p className="text-2xl font-semibold text-gray-800">{profile.followingCount ?? 0}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Following</p>
                                </button>
                            </div>
                        ) : (<p className="text-center text-red-600 mt-4 text-sm">{error || "Could not load stats."}</p>)}
                </div>

                {/* Average Score */}
                {isLoadingProfile ? null : profile && (
                    <div className="text-center px-4 py-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Average Score</h3>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-1 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: `${averageScoreValue}%` }}></div>
                        </div>
                        <p className="text-xl font-semibold text-green-600">{displayAverageScore}%</p>
                    </div>
                )}

                {/* Select a Topic */}
                <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-5 text-center">Select a Topic</h2>
                    {isLoadingTopics ? (<LoadingSpinner />)
                        : error && topics.length === 0 ? (<p className="text-center text-red-600 text-sm">{error.includes("topics") ? error : "Could not load topics."}</p>)
                            : topics.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {topics.map(topic => (
                                        <button
                                            key={topic.name || 'general'}
                                            onClick={() => {
                                                setSelectedTopic(topic.name);
                                                setQuizState('topic_detail');
                                            }}
                                            className={`group flex flex-col items-center justify-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:-translate-y-1 duration-200 ease-in-out aspect-square border-gray-200`}
                                        >
                                            <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-200 bg-red-100 group-hover:bg-red-200`}>
                                                {topic.logoUrl ? (
                                                    <img src={topic.logoUrl} alt={`${topic.name} logo`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                                ) : (
                                                    <TopicPlaceholderIcon />
                                                )}
                                            </div>
                                            <span className={`text-sm font-semibold text-center capitalize break-words transition-colors duration-200 text-gray-700 group-hover:text-primary-dark`}>{topic.name || 'General'}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (<p className="text-gray-500 text-center col-span-full py-4">No quiz topics found.</p>)}
                </div>
            </div>
        );
    }; // End renderDashboard

    // --- renderTopicDetailView ---
    // This view is mostly unchanged, but reflects new primary color
    const renderTopicDetailView = () => {
        if (!selectedTopic) {
            backToDashboard();
            return <LoadingSpinner />;
        }

        const topicInfo = topics.find(t => t.name === selectedTopic);
        const progress = myProfileData?.topicProgress.find(p => p.topic === selectedTopic);
        const currentLevel = progress?.level || 1;
        const currentXP = progress?.xp || 0;
        const currentTitle = progress?.currentTitle || null;
        const xpForThisLevel = progress ? progress.xpForCurrentLevel : xpFormulas.calculateXpForLevel(currentLevel);
        const xpForNextLevel = progress ? progress.xpToNextLevel : xpFormulas.calculateXpForLevel(currentLevel + 1);
        const xpInThisLevel = currentXP - xpForThisLevel;
        const xpNeededForThisLevel = xpForNextLevel - xpForThisLevel;
        let percentage = (xpNeededForThisLevel > 0) ? Math.floor((xpInThisLevel / xpNeededForThisLevel) * 100) : 0;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        const userHighScore = leaderboard.find(entry => entry.username === loggedInUsername)?.highScore;

        return (
            <div className="w-full animate-fade-in -m-8">
                <div className="bg-gray-800 text-white p-6 rounded-t-lg" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                    <button onClick={backToDashboard} className="text-white opacity-80 hover:opacity-100 font-medium z-10 flex items-center focus:outline-none mb-4">
                        <ArrowLeftIcon /> Back to Topics
                    </button>
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                        <div className="w-32 h-32 md:w-40 md:h-40 mb-4 md:mb-0 md:mr-6 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-white/90 border-4 border-white shadow-lg">
                            {topicInfo?.logoUrl ? (
                                <img src={topicInfo.logoUrl} alt={`${selectedTopic} logo`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                                <TopicDetailPlaceholderIcon />
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <h1 className="text-4xl font-bold text-white capitalize">{selectedTopic}</h1>
                            <p className="text-lg text-gray-300 mt-1 mb-4">{currentTitle || "Unlock your first title!"}</p>
                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 mb-6">
                                <button
                                    onClick={() => startQuiz(selectedTopic)}
                                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition duration-200 transform hover:scale-105"
                                >
                                    <PlayIcon /> <span className="text-lg">Play</span>
                                </button>
                                <button
                                    onClick={() => { document.getElementById('rankings-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white/90 text-gray-900 font-bold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition duration-200"
                                >
                                    <RankingsIcon /> <span className="text-lg">Rankings</span>
                                </button>
                            </div>
                            <div className="w-full max-w-sm mx-auto md:mx-0 mb-4">
                                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">XP Progress (Level {currentLevel})</span>
                                <div className="w-full bg-black/30 rounded-full h-2.5 shadow-inner mt-1">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-300 text-right mt-1">{currentXP} / {xpForNextLevel} XP</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center mt-6 border-t border-white/10 pt-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Your Level</p>
                            <p className="text-3xl font-bold text-white">{currentLevel}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Your XP</p>
                            <p className="text-3xl font-bold text-white">{currentXP.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Your Top Score</p>
                            <p className="text-3xl font-bold text-white">{userHighScore !== undefined ? userHighScore : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Section (Outside dark bg) */}
                <div id="rankings-section" className="p-6">
                    {/* ... leaderboard content would go here ... */}
                </div>
            </div>
        );
    };


    // --- renderQuizScreen ---
    const renderQuizScreen = () => {
        const actualQuizTopic = questions.length > 0 ? (questions[0]?.topic || selectedTopic || "Unknown") : (selectedTopic || "Unknown");
        if (!questions || questions.length === 0) return (<div className="text-center py-10"><LoadingSpinner /><p className="mt-2 text-gray-600">Loading questions...</p><button onClick={backToTopicDetail} className="mt-4 px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dark transition">Back to Topic</button></div>);
        if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) return <div>Error loading question index. <button onClick={backToTopicDetail}>Back to Topic</button></div>;
        const question = questions[currentQuestionIndex]; if (!question) return <div>Error loading question data. <button onClick={backToTopicDetail}>Back to Topic</button></div>;
        const selectedOption = selectedAnswers[question.id]; const isLastQuestion = currentQuestionIndex === questions.length - 1;
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

        return (
            <div className="w-full animate-fade-in">
                <button onClick={backToTopicDetail} className="absolute top-20 left-4 text-primary hover:text-primary-dark font-medium z-10 flex items-center focus:outline-none">
                    <ArrowLeftIcon /> Back to Topic
                </button>
                <div className="mb-6 pt-8">
                    <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="font-semibold px-2 py-0.5 rounded-full text-primary-dark bg-red-100">Question {currentQuestionIndex + 1}/{questions.length}</span>
                        <span className="font-semibold px-2 py-0.5 rounded-full text-gray-600 bg-gray-200 capitalize">Topic: {actualQuizTopic}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-2 rounded-full transition-all duration-300 ease-linear" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
                {question.imageUrl && (
                    <div className="mb-6 w-full max-h-72 overflow-hidden rounded-lg shadow-md flex justify-center items-center bg-gray-50 border">
                        <img src={question.imageUrl} alt={`Question visual aid`} className="object-contain max-h-72" onError={(e) => { e.target.style.display = 'none'; console.error("Image failed:", question.imageUrl); }} />
                    </div>
                )}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 leading-snug">{question.questionText}</h2>
                <div className="space-y-3">
                    {['A', 'B', 'C', 'D'].map(option => (
                        question[`option${option}`] !== undefined && question[`option${option}`] !== null &&
                        <button
                            key={option}
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-base flex items-center group focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${selectedOption === option
                                ? 'bg-primary border-primary-dark text-white font-semibold shadow-md ring-2 ring-offset-1 ring-primary-dark'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-red-50 hover:border-primary'
                            }`}
                        >
                            <span className={`font-bold mr-3 rounded-full border w-6 h-6 flex items-center justify-center text-xs transition-colors ${selectedOption === option ? 'border-white text-white bg-primary-dark' : 'border-gray-400 text-gray-500 group-hover:border-primary group-hover:text-primary'}`}>{option}</span>
                            {question[`option${option}`]}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between mt-8">
                    <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">Previous</button>
                    {isLastQuestion ? (
                        <button onClick={handleSubmit} disabled={isLoading || isSubmitting} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center min-w-[120px]">
                            {isLoading || isSubmitting ? <LoadingSpinner /> : 'Submit Quiz'}
                        </button>
                    ) : (
                        <button onClick={handleNext} className="px-6 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Next</button>
                    )}
                </div>
                {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
            </div>
        );
    };

    // --- renderResultScreen ---
    const renderResultScreen = () => {
        const { score, totalQuestions, topic, newAchievements, newTitles } = quizResult || {};
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        return (
            <div className="text-center animate-fade-in py-8">
                <CheckCircleIcon />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
                <p className="text-md text-gray-600 mb-4 capitalize">Topic: {topic || selectedTopic || 'General'}</p>

                {newAchievements && newAchievements.length > 0 && (
                    <div className="my-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                        <h4 className="text-lg font-semibold text-yellow-800 mb-3">New Achievements!</h4>
                        {renderAchievementBadges(newAchievements)}
                    </div>
                )}

                {newTitles && newTitles.length > 0 && (
                    <div className="my-6 p-4 bg-purple-50 border border-purple-200 rounded-lg max-w-md mx-auto">
                        <h4 className="text-lg font-semibold text-purple-800 mb-3">New Title Unlocked!</h4>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {newTitles.map(title => (
                                <div key={title} className="flex items-center p-2 rounded-lg border shadow-sm bg-purple-100 border-purple-300">
                                    <TrophyIcon />
                                    <span className="ml-2 text-sm font-semibold text-purple-700">{title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block shadow-md mb-8">
                    <p className="text-xl text-gray-700 mb-1">Your Score:</p>
                    <p className="text-5xl font-bold text-primary mb-2">{score} / {totalQuestions}</p>
                    <p className="text-2xl font-semibold text-gray-800">({percentage}%)</p>
                </div>
                <button onClick={backToTopicDetail} className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 transform hover:scale-105">
                    Back to Topic Details
                </button>
            </div>
        );
    };

    // --- renderAuthForm ---
    const renderAuthForm = () => (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{isLoginView ? 'Quiz App Login' : 'Create Account'}</h1>
                <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="usernameA" className="block text-gray-700 text-sm font-semibold mb-1.5">Username:</label>
                        <input type="text" id="usernameA" value={username} onChange={(e) => setUsername(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="passwordA" className="block text-gray-700 text-sm font-semibold mb-1.5">Password:</label>
                        <input type="password" id="passwordA" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required />
                    </div>
                    {error && <p className="text-red-600 text-sm text-center py-1">{error}</p>}
                    {message && <p className="text-green-600 text-sm text-center py-1">{message}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center min-h-[40px]">
                        {isLoading ? <LoadingSpinner /> : (isLoginView ? 'Login' : 'Register')}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">{isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(null); setMessage(null); setUsername(''); setPassword(''); }} className="font-semibold text-primary hover:text-primary-dark ml-1 focus:outline-none">
                        {isLoginView ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );

    // --- RENDER PROFILE (PUBLIC) ---
    // This function is heavily redesigned to match the screenshot
    const renderProfile = ({ profileData, title }) => {

        // --- Follow List (Modal) ---
        // This is kept as a modal-like view to avoid cluttering the main profile
        const renderFollowList = (listTitle, listItems, emptyMessage) => (
            <div className="w-full animate-fade-in">
                <button onClick={() => { setShowFollowersList(false); setShowFollowingList(false); }} className="absolute top-20 left-4 text-primary hover:text-primary-dark font-medium z-10 focus:outline-none flex items-center">&larr; Back to Profile</button>
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center pt-8">{listTitle}</h1>
                <div className="bg-white rounded-lg shadow-md p-4 space-y-3 max-h-96 overflow-y-auto border border-gray-200">{listItems && listItems.length > 0 ? (listItems.map(user => (<div key={user.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"><span className="text-gray-700 font-medium capitalize">{user.username}</span>{(loggedInUsername !== user.username) && <button onClick={() => { setShowFollowersList(false); setShowFollowingList(false); fetchPublicProfile(user.username); }} className="text-xs text-primary hover:text-primary-dark font-semibold px-3 py-1 rounded-md hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors">View</button>}</div>))) : (<p className="text-gray-500 text-sm text-center py-4">{emptyMessage}</p>)}</div>
                <button onClick={() => { setShowFollowersList(false); setShowFollowingList(false); }} className="w-full mt-6 px-8 py-2.5 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">Close</button>
            </div>
        );

        if (showFollowersList) return renderFollowList(`Followers (${profileData?.followersCount ?? 0})`, profileData?.followers, "Not followed by anyone yet.");
        if (showFollowingList) return renderFollowList(`Following (${profileData?.followingCount ?? 0})`, profileData?.following, "Not following anyone yet.");

        // --- Loading State ---
        if (isLoadingProfile || !profileData) return (
            <div className="text-center py-10">
                <button onClick={() => setQuizState('search')} className="absolute top-20 left-4 text-primary hover:text-primary-dark font-medium z-10 focus:outline-none">&larr; Back to Search</button>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
                <LoadingSpinner />
            </div>
        );

        // --- Profile Data ---
        const { username: profileUsername, totalQuizzesTaken, averageScore, followersCount, followingCount, isFollowedByCurrentUser, profilePictureUrl, achievements, topicProgress } = profileData;
        const displayAverageScore = typeof averageScore === 'number' ? averageScore.toFixed(1) : 'N/A';
        const bestTitle = topicProgress?.find(p => p.currentTitle)?.currentTitle || null;
        const profileAchievements = (achievements || []).slice(0, 4); // Get first 4 achievements

        return (
            // Removed padding from main card, will apply to children
            <div className="w-full animate-fade-in -m-8">

                {/* --- Profile Header (Cover, Pic, Info) --- */}
                <div className="relative pb-4">
                    {/* Cover Photo Placeholder */}
                    <div className="h-40 bg-gray-300">
                        <img
                            src={`https://placehold.co/600x200/94a3b8/e2e8f0?text=${profileUsername}'s+Cover`}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Profile Picture & Badges */}
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 w-32 h-32">
                        <div className="relative w-32 h-32">
                            {profilePictureUrl ? (
                                <img
                                    src={profilePictureUrl}
                                    alt={profileUsername}
                                    className="w-32 h-32 rounded-full bg-gray-200 mx-auto border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                    <UserPlaceholderIcon />
                                </div>
                            )}

                            {/* Achievement Badges */}
                            {profileAchievements.map(code => {
                                const details = ACHIEVEMENT_DETAILS[code];
                                if (!details) return null;
                                return (
                                    <div
                                        key={code}
                                        title={`${details.name}: ${details.description}`}
                                        className={`absolute w-8 h-8 rounded-full ${details.color} ${details.text} ${details.position} flex items-center justify-center border-2 border-white shadow-md p-1`}
                                    >
                                        {details.icon}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* User Info Text */}
                    <div className="mt-20 text-center px-6">
                        <h1 className="text-3xl font-bold text-gray-800 capitalize">{profileUsername}</h1>
                        <p className="text-sm text-gray-500 mt-1">Member of Quiz App</p>
                        <p className="text-sm text-gray-500 mt-1">
                            <LocationIcon />
                            {/* Placeholder location */}
                            Global
                        </p>
                        {/* Placeholder Last Active */}
                        <p className="text-xs text-gray-400 mt-1">Last Active: 5 minutes ago</p>
                    </div>

                    {/* Best Title Banner */}
                    {bestTitle && (
                        <div className="mt-4 mx-6 p-2 bg-yellow-400 text-yellow-900 font-semibold text-center rounded-lg shadow">
                            <TrophyIcon />
                            Best in {bestTitle}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 px-6 grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setQuizState('dashboard')}
                            className="flex items-center justify-center px-4 py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-200"
                        >
                            <PlayButtonIcon />
                            Play
                        </button>

                        {isFollowedByCurrentUser ? (
                            <button onClick={() => handleUnfollow(profileUsername)} disabled={isSubmitting} className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                {isSubmitting ? <LoadingSpinner /> : <><UserMinusIcon /> Unfollow</>}
                            </button>
                        ) : (
                            <button onClick={() => handleFollow(profileUsername)} disabled={isSubmitting} className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                {isSubmitting ? <LoadingSpinner /> : <><UserMinusIcon /> Follow</>}
                            </button>
                        )}

                        <button
                            onClick={() => { setActiveChatUser(profileUsername); setShowChat(true); setShowChatList(false); }}
                            disabled={!isChatConnected}
                            className="flex items-center justify-center px-4 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                        >
                            <ChatBubbleIcon />
                            Chat
                        </button>
                    </div>
                </div>

                {/* --- Statistics Section --- */}
                <div className="bg-white p-6 border-t border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Statistics</h2>
                    <div className="space-y-4">
                        {/* Adapted stats: Quizzes and Avg Score */}
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-600">Total Quizzes Taken</span>
                            <span className="font-bold text-lg text-gray-800">{totalQuizzesTaken ?? 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-600">Followers</span>
                            <span className="font-bold text-lg text-gray-800">{followersCount ?? 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-600">Following</span>
                            <span className="font-bold text-lg text-gray-800">{followingCount ?? 0}</span>
                        </div>

                        {/* Average Score as a progress bar */}
                        <div>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="font-medium text-gray-600">Average Score</span>
                                <span className="font-bold text-lg text-green-600">{displayAverageScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${averageScore}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Topics Section --- */}
                <div className="bg-white p-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Topics</h2>
                        <button onClick={backToDashboard} className="text-sm font-semibold text-primary hover:text-primary-dark">SEE ALL</button>
                    </div>
                    {topicProgress && topicProgress.length > 0 ? (
                        <div className="space-y-4 max-w-lg mx-auto">
                            {topicProgress.sort((a, b) => b.xp - a.xp).slice(0, 3).map(prog => { // Show top 3 topics
                                const xpInThis = prog.xp - prog.xpForCurrentLevel;
                                const xpNeeded = prog.xpToNextLevel - prog.xpForCurrentLevel;
                                const percent = (xpNeeded > 0) ? Math.floor((xpInThis / xpNeeded) * 100) : 0;
                                return (
                                    <div key={prog.topic} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-bold text-primary capitalize">{prog.topic}</span>
                                            <span className="text-sm font-semibold text-gray-700">
                                                Level {prog.level}
                                                {prog.currentTitle && <span className="text-xs text-yellow-600 ml-1">({prog.currentTitle})</span>}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-right mt-1">{prog.xp} XP</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-2">No quiz progress yet.</p>
                    )}
                </div>
            </div>
        );
    }; // End of renderProfile

    // --- renderSearch ---
    const renderSearch = () => (
        <div className="w-full animate-fade-in">
            <button onClick={backToDashboard} className="absolute top-20 left-4 text-primary hover:text-primary-dark font-medium z-10 focus:outline-none flex items-center">&larr; Back to Dashboard</button>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 pt-4">Search Users</h1>
            <form onSubmit={handleSearch} className="flex space-x-2 mb-6"><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter username..." /><button type="submit" disabled={isLoading || !searchQuery.trim()} className="px-5 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center min-w-[90px]">{isLoading ? <LoadingSpinner /> : 'Search'}</button></form>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <div className="space-y-3 mt-6">{searchResults.length > 0 ? (searchResults.map(user => (<div key={user.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"><p className="text-md font-medium text-gray-800 capitalize">{user.username}</p><button onClick={() => fetchPublicProfile(user.username)} className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors">View Profile</button></div>)))
                : (!isLoading && searchQuery && <p className="text-gray-500 text-center py-4">No users found matching '{searchQuery}'.</p>)}</div>
        </div>
    );

    // --- renderChat ---
    const renderChat = () => {
        if (!showChat || !activeChatUser) return null;
        const currentChatMessages = chatMessages[activeChatUser] || [];
        return (
            <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-50 h-[500px]">
                <div className="bg-primary text-white p-3 rounded-t-lg flex justify-between items-center flex-shrink-0 shadow-sm"><h3 className="font-semibold capitalize">Chat with {activeChatUser}</h3><button onClick={() => { setActiveChatUser(null); setShowChat(false); setChatInput(''); }} className="text-red-100 hover:text-white transition-colors text-xl font-bold leading-none p-1 -m-1 rounded-full focus:outline-none focus:ring-1 focus:ring-white">&times;</button></div>
                <div className="flex-grow p-3 overflow-y-auto bg-gray-50" ref={chatMessagesEndRef}>
                    {!isChatConnected && <p className="text-xs text-center text-red-600 px-3 py-1 bg-red-100 rounded mb-2">Connecting...</p>}
                    {currentChatMessages.map((msg, index) => (<div key={`${msg.sender}-${msg.timestamp || index}`} className={`mb-2 flex ${msg.sender === 'System' ? 'justify-center' : (msg.sender === loggedInUsername ? 'justify-end' : 'justify-start')}`}>{msg.sender === 'System' ? (<span className="text-xs text-gray-500 italic my-1">{msg.content}</span>) : (<div className={`max-w-[80%]`}> {msg.sender !== loggedInUsername && (<span className="text-xs text-gray-500 block capitalize px-1 mb-0.5">{msg.sender}</span>)} <span className={`inline-block px-3 py-1.5 rounded-lg text-sm break-words shadow-sm ${(msg.SENDER === loggedInUsername ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none')}`}>{msg.content}</span></div>)}</div>))}
                    <div ref={chatMessagesEndRef} />
                </div>
                <form onSubmit={sendChatMessage} className="p-2 border-t border-gray-200 flex flex-shrink-0 bg-white rounded-b-lg"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-grow border border-gray-300 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-100" disabled={!isChatConnected} /><button type="submit" className="bg-primary text-white px-4 py-1.5 rounded-r-md text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary" disabled={!isChatConnected || !chatInput.trim()}>Send</button></form>
            </div>);
    };

    // --- renderNotificationToasts (Combined Toast Renderer) ---
    const renderNotificationToasts = () => {
        let toastContent = null;

        if (newAchievementToast.length > 0) {
            toastContent = (
                <>
                    <h4 className="text-lg font-semibold text-yellow-700 text-center mb-3">Achievement Unlocked!</h4>
                    <div className="flex flex-col gap-2">
                        {newAchievementToast.map(code => {
                            const details = ACHIEVEMENT_DETAILS[code];
                            if (!details) return null;
                            return (
                                <div key={code} className={`flex items-center p-2 rounded ${details.color}`}>
                                    <span className={details.text}>{React.cloneElement(details.icon, { className: "h-6 w-6" })}</span>
                                    <div className="ml-3">
                                        <p className={`font-semibold text-sm ${details.text}`}>{details.name}</p>
                                        <p className={`text-xs ${details.text.replace('700', '600')}`}>{details.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            );
        } else if (newTitleToast.length > 0) {
            toastContent = (
                <>
                    <h4 className="text-lg font-semibold text-purple-700 text-center mb-3">Title Unlocked!</h4>
                    <div className="flex flex-col gap-2">
                        {newTitleToast.map(title => (
                            <div key={title} className="flex items-center p-2 rounded bg-purple-100">
                                <span className="text-purple-700"><TrophyIcon /></span>
                                <div className="ml-3">
                                    <p className="font-semibold text-sm text-purple-700">{title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }

        if (!toastContent) return null;

        return (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md p-4">
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-fade-in">
                    {toastContent}
                </div>
            </div>
        );
    };

    // --- Main App Render Logic ---
    if (!isAuthenticated) return renderAuthForm();

    // In the new design, the TopNavBar shows the *current view's* title, not the logged-in user.
    // We'll calculate the title based on the state.
    let navTitle = 'Dashboard';
    if (quizState === 'public_profile') {
        navTitle = publicProfileData?.username || 'Profile';
    } else if (quizState === 'search') {
        navTitle = 'Search';
    } else if (quizState === 'topic_detail') {
        navTitle = selectedTopic || 'Topic';
    } else if (quizState === 'in_progress' || quizState === 'finished') {
        navTitle = selectedTopic || 'Quiz';
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <TopNavBar
                username={navTitle} // Pass the dynamic title instead of the logged-in user
                onLogout={handleLogout} // Logout is still needed, though the button is hidden in the new nav
                onSearchClick={() => { setQuizState('search'); setShowChatList(false); setShowChat(false); setSelectedTopic(null); }}
                onChatClick={toggleChatList}
                chatNotifications={unreadMessagesCount}
            />

            {/* Main content area */}
            <div className="flex flex-col items-center overflow-y-auto pt-16 pb-10"> {/* pt-16 for fixed nav */}

                {/* The new design is "card-less" on the profile page.
                  We'll use max-w-3xl for most states, but remove padding/shadow for the new profile view.
                */}
                <main className={`w-full max-w-3xl relative my-4 
                    ${(quizState === 'public_profile' || quizState === 'topic_detail') ? '' : 'p-6 sm:p-8 space-y-6 bg-white rounded-lg shadow-lg'}
                `}>

                    {/* Error/Message bar for non-profile states */}
                    {quizState !== 'public_profile' && quizState !== 'topic_detail' && (
                        <>
                            {message && !showChatList && !showChat && <p className="p-3 bg-green-100 text-green-800 rounded-md text-sm mb-4 border border-green-200 animate-fade-in">{message}</p>}
                            {error && !showChatList && !showChat && <p className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-4 border border-red-200 animate-fade-in">{error}</p>}
                        </>
                    )}

                    {quizState === 'dashboard' && renderDashboard()}
                    {quizState === 'topic_detail' && renderTopicDetailView()}
                    {quizState === 'in_progress' && renderQuizScreen()}
                    {quizState === 'finished' && renderResultScreen()}
                    {quizState === 'search' && renderSearch()}
                    {quizState === 'public_profile' && renderProfile({ profileData: publicProfileData, title: `${publicProfileData?.username || 'User'}'s Profile` })}
                </main>
            </div>

            {showChatList && (
                <ChatList
                    chatPartners={chatPartners}
                    onUserSelect={handleUserSelectFromList}
                    onClose={() => setShowChatList(false)}
                />
            )}

            {renderChat()}

            {renderNotificationToasts()}
        </div>
    );
}

export default App;
