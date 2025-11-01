import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';

// --- Simple Placeholder Icons ---
const TopicsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const QuestionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M11.99 2.05c.53-.02 1.07.1 1.53.39l.74.46c.46.29.99.46 1.53.51h.04c.54.05 1.07.22 1.53.49l.76.47c.71.44 1.05 1.35.79 2.14l-.26.79c-.16.5-.19 1.04-.09 1.56l.16.82c.26.86-.06 1.8-.79 2.3l-.5.34c-.45.3-.8.7-.99 1.17l-.23.63c-.32.86-1.2 1.4-2.13 1.4h-.05c-.5 0-1-.15-1.42-.42l-.69-.45c-.45-.29-.98-.45-1.53-.49h-.03c-.54-.05-1.07-.22-1.53-.49l-.7-.44c-.72-.45-1.05-1.37-.79-2.16l.26-.8c-.16.5-.19 1.04-.09 1.56l.16.82c.26.86-.06 1.8-.79 2.3l-.5.34c-.45.3-.8.7-.99 1.17l-.23.63c-.32.86-1.2 1.4-2.13 1.4h-.04c-.5 0-1-.15-1.42-.42l-.69-.45zM8.99 17.06c-.53.02-1.07-.1-1.53-.39l-.74-.46c-.46-.29-.99-.46-1.53-.51h-.04c-.54-.05-1.07-.22-1.53-.49l-.76-.47c-.71-.44-1.05-1.35-.79-2.14l.26-.79c.16-.5.19-1.04.09-1.56l-.16-.82c-.26-.86.06-1.8.79-2.3l.5-.34c.45-.3.8-.7.99-1.17l.23-.63c.32-.86 1.2-1.4 2.13-1.4h.05c.5 0 1 .15 1.42.42l.69.45c.45.29.98.45 1.53.49h.03c.54.05 1.07.22 1.53.49l.7.44c.72.45 1.05 1.37.79 2.16l-.26.8c-.16.5-.19 1.04-.09 1.56l.16.82c.26.86-.06 1.8-.79 2.3l-.5.34c-.45.3-.8.7-.99 1.17l-.23.63c-.32.86-1.2 1.4-2.13 1.4h-.04c-.5 0-1-.15-1.42-.42l-.69-.45z" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM18.707 1.293a1 1 0 011.414 0l.707.707a1 1 0 010 1.414L18 6.207l-2.828-2.828L18.707 1.293zM3 16a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H3z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const LoadingSpinner = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-dark"></div>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

// --- Axios Setup ---
const getAuthToken = () => localStorage.getItem('adminToken');
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
    // Question Form
    const [questionId, setQuestionId] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [optionA, setOptionA] = useState(''); const [optionB, setOptionB] = useState(''); const [optionC, setOptionC] = useState(''); const [optionD, setOptionD] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('A');
    const [topic, setTopic] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Data Lists
    const [allQuestions, setAllQuestions] = useState([]);
    const [uniqueTopics, setUniqueTopics] = useState([]);

    // Title Reward State
    const [titleRewards, setTitleRewards] = useState([]);
    const [isLoadingTitles, setIsLoadingTitles] = useState(false);
    const [editingTitleId, setEditingTitleId] = useState(null);
    const [titleForm, setTitleForm] = useState({ topic: '', levelRequired: 1, title: '' });

    // View Management
    const [activeView, setActiveView] = useState('topics'); // 'topics', 'questions', 'add_edit_form', 'titles'
    const [selectedManageTopic, setSelectedManageTopic] = useState(null);

    // UI Feedback
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Modal State
    const [showTopicEditModal, setShowTopicEditModal] = useState(false);
    const [editingTopicInfo, setEditingTopicInfo] = useState({ name: '', logoUrl: '' });
    const [modalTopicLogoUrl, setModalTopicLogoUrl] = useState('');

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Loading States
    const [isLoading, setIsLoading] = useState(false); // General loading for submit/delete
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);
    const [isSubmittingTitle, setIsSubmittingTitle] = useState(false);

    // Refs
    const formRef = useRef(null);
    const titleFormRef = useRef(null);

    // --- API Error Handler ---
    const handleApiError = useCallback((err, defaultMessage) => {
        console.error("API Error:", err);
        let specificError = defaultMessage || 'An unexpected error occurred.';
        if (err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
                specificError = 'Unauthorized or session expired. Please log in again.';
                localStorage.removeItem('adminToken'); setIsAuthenticated(false);
                setUsername(''); setPassword(''); clearForm();
                setActiveView('topics'); setSelectedManageTopic(null);
                clearTitleForm();
            } else if (err.response.data && typeof err.response.data === 'string') { specificError = err.response.data; }
            else { specificError = `Error: ${err.response.status} ${err.response.statusText || 'Unknown Error'}`; }
        } else if (err.request) { specificError = 'Network error. Could not reach server.'; }
        else if (err.message) { specificError = err.message; }
        setError(specificError);
        setIsLoading(false); setIsLoadingTopics(false); setIsLoadingQuestions(false); setIsSubmittingTopic(false);
        setIsLoadingTitles(false);
        setIsSubmittingTitle(false);
        setMessage('');
    }, []);

    // --- Logout Handler ---
    const handleLogout = useCallback(() => {
        localStorage.removeItem('adminToken'); setIsAuthenticated(false);
        setMessage('Logged out successfully.'); setError('');
        setUsername(''); setPassword(''); clearForm();
        setAllQuestions([]); setUniqueTopics([]);
        setActiveView('topics'); setSelectedManageTopic(null);
        setShowTopicEditModal(false); setEditingTopicInfo({ name: '', logoUrl: ''});
        setTitleRewards([]);
        clearTitleForm();
    }, []);

    // --- Data Fetching ---
    const fetchUniqueTopics = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoadingTopics(true); setError(''); setMessage('');
        try { const response = await api.get('/api/quiz/topics'); setUniqueTopics(response.data || []); }
        catch (err) { handleApiError(err, 'Failed to load topics.'); setUniqueTopics([]); }
        finally { setIsLoadingTopics(false); }
    }, [isAuthenticated, handleApiError]);

    const fetchAllQuestions = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoadingQuestions(true); setError(''); setMessage('');
        try { const response = await api.get('/api/admin/questions'); setAllQuestions(response.data || []); }
        catch (err) { handleApiError(err, 'Failed to fetch questions.'); setAllQuestions([]); }
        finally { setIsLoadingQuestions(false); }
    }, [isAuthenticated, handleApiError]);

    const fetchTitleRewards = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoadingTitles(true); setError(''); setMessage('');
        try {
            const response = await api.get('/api/admin/titles');
            setTitleRewards(response.data || []);
        } catch (err) {
            handleApiError(err, 'Failed to load title rewards.');
            setTitleRewards([]);
        } finally {
            setIsLoadingTitles(false);
        }
    }, [isAuthenticated, handleApiError]);


    // --- useEffect Hooks ---
    useEffect(() => {
        if (isAuthenticated) {
            if (activeView === 'topics') {
                fetchUniqueTopics();
            }
            if (allQuestions.length === 0 || activeView === 'questions') {
                fetchAllQuestions();
            }
            if (activeView === 'titles') {
                fetchTitleRewards();
            }
        } else {
            setAllQuestions([]);
            setUniqueTopics([]);
            setTitleRewards([]);
        }
    }, [isAuthenticated, activeView, fetchAllQuestions, fetchUniqueTopics, allQuestions.length, fetchTitleRewards]);

    useEffect(() => {
        if (activeView === 'add_edit_form') {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeView]);

    useEffect(() => {
        if (activeView === 'titles' && editingTitleId) {
            titleFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeView, editingTitleId]);


    // --- FORM & CRUD LOGIC (Questions) ---
    const clearForm = (keepTopic = false) => {
        setQuestionId(null); setQuestionText(''); setOptionA(''); setOptionB(''); setOptionC(''); setOptionD('');
        setCorrectAnswer('A'); if (!keepTopic) setTopic(''); setImageUrl('');
    };

    const handleEditClick = (question) => {
        if (!question || typeof question !== 'object') { setError("Invalid question data."); return; }
        setQuestionId(question.id); setQuestionText(question.questionText || '');
        setOptionA(question.optionA || ''); setOptionB(question.optionB || ''); setOptionC(question.optionC || ''); setOptionD(question.optionD || '');
        setCorrectAnswer(question.correctAnswer || 'A'); setTopic(question.topic || '');
        setImageUrl(question.imageUrl || '');
        setMessage(`Editing question for topic: ${question.topic || 'Unknown'}`); setError('');
        setActiveView('add_edit_form');
    };

    const handleAddQuestionToTopic = (topicName) => {
        clearForm(true); setTopic(topicName);
        setMessage(`Adding new question to topic: ${topicName}`); setError('');
        setActiveView('add_edit_form');
    };

    const handleAddQuestionNewTopic = () => {
        clearForm(false);
        setMessage('Add a question for a new or existing topic.'); setError('');
        setActiveView('add_edit_form');
    };

    const handleDelete = async (id, topicName) => {
        if (window.confirm(`Are you sure you want to delete this question?`)) {
            setIsLoading(true); setMessage(''); setError('');
            try {
                await api.delete(`/api/admin/questions/${id}`);
                setMessage('Question deleted successfully!');

                // Refetch questions to update list
                const questionsResponse = await api.get('/api/admin/questions');
                const updatedQuestions = questionsResponse.data || [];
                setAllQuestions(updatedQuestions); // Update state directly

                // Check if it was the last question of the topic
                const remainingQuestions = updatedQuestions.filter(q => q.topic === topicName);
                if (remainingQuestions.length === 0) {
                    fetchUniqueTopics(); // Refresh topic list
                    setActiveView('topics'); // Go back to topics if last question deleted
                    setSelectedManageTopic(null);
                } else {
                    // Stay on questions view if there are remaining questions for the topic
                    setActiveView('questions');
                }

            } catch (err) { handleApiError(err, 'Failed to delete question.'); }
            finally { setIsLoading(false); }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsLoading(true); setMessage(''); setError('');
        const questionData = { questionText: questionText.trim(), optionA: optionA.trim(), optionB: optionB.trim(), optionC: optionC.trim(), optionD: optionD.trim(), correctAnswer, topic: topic.trim(), imageUrl: imageUrl.trim() ? imageUrl.trim() : null };
        if (!questionData.topic || !questionData.questionText || !questionData.optionA || !questionData.optionB || !questionData.optionC || !questionData.optionD) { setError("Please fill all required fields (Topic, Question, Options A-D)."); setIsLoading(false); return; }

        try {
            let response; let updatedQuestion;
            if (questionId) { response = await api.put(`/api/admin/questions/${questionId}`, questionData); updatedQuestion = response.data; setMessage('Question updated successfully!'); }
            else { response = await api.post('/api/admin/questions', questionData); updatedQuestion = response.data; setMessage('Question added successfully!'); }

            clearForm();
            fetchAllQuestions();
            fetchUniqueTopics();

            setSelectedManageTopic(updatedQuestion.topic);
            setActiveView('questions');

        } catch (err) { handleApiError(err, questionId ? 'Failed to update question.' : 'Failed to add question.'); }
        finally { setIsLoading(false); }
    };

    // --- Title Reward CRUD Logic ---
    const clearTitleForm = () => {
        setEditingTitleId(null);
        setTitleForm({ topic: '', levelRequired: 1, title: '' });
    };

    const handleTitleFormChange = (e) => {
        const { name, value } = e.target;
        setTitleForm(prev => ({
            ...prev,
            [name]: name === 'levelRequired' ? (value ? Math.max(1, parseInt(value, 10)) : 1) : value
        }));
    };

    const handleTitleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingTitle(true);
        setMessage(''); setError('');

        const { topic, levelRequired, title } = titleForm;
        if (!topic.trim() || !title.trim() || !levelRequired || levelRequired < 1) {
            setError("All fields are required and level must be at least 1.");
            setIsSubmittingTitle(false);
            return;
        }

        const payload = { topic: topic.trim(), levelRequired, title: title.trim() };

        try {
            if (editingTitleId) {
                await api.put(`/api/admin/titles/${editingTitleId}`, payload);
                setMessage('Title reward updated successfully!');
            } else {
                await api.post('/api/admin/titles', payload);
                setMessage('Title reward created successfully!');
            }
            clearTitleForm();
            fetchTitleRewards();
        } catch (err) {
            handleApiError(err, editingTitleId ? 'Failed to update reward' : 'Failed to create reward');
        } finally {
            setIsSubmittingTitle(false);
        }
    };

    const handleTitleEditClick = (reward) => {
        setEditingTitleId(reward.id);
        setTitleForm({
            topic: reward.topic,
            levelRequired: reward.levelRequired,
            title: reward.title
        });
        titleFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleTitleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this title reward?')) {
            setIsLoading(true);
            setMessage(''); setError('');
            try {
                await api.delete(`/api/admin/titles/${id}`);
                setMessage('Reward deleted successfully!');
                fetchTitleRewards();
                if (editingTitleId === id) {
                    clearTitleForm();
                }
            } catch (err) {
                handleApiError(err, 'Failed to delete reward.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // --- Topic Info Update Logic ---
    const handleOpenTopicEditModal = (topicInfo) => {
        setEditingTopicInfo(topicInfo); setModalTopicLogoUrl(topicInfo.logoUrl || '');
        setShowTopicEditModal(true); setMessage(''); setError('');
    };

    const handleUpdateTopicInfo = async (e) => {
        e.preventDefault(); if (!editingTopicInfo?.name) return;
        setIsSubmittingTopic(true); setError(''); setMessage('');
        const topicName = editingTopicInfo.name; const newLogoUrl = modalTopicLogoUrl.trim() ? modalTopicLogoUrl.trim() : null;
        try {
            const encodedTopicName = encodeURIComponent(topicName);
            await api.put(`/api/admin/topics/${encodedTopicName}`, { logoUrl: newLogoUrl });
            setMessage(`Logo for topic "${topicName}" updated!`); setShowTopicEditModal(false);
            fetchUniqueTopics();
            fetchAllQuestions();
        } catch (err) { handleApiError(err, `Failed to update logo for topic "${topicName}".`); setShowTopicEditModal(false); }
        finally { setIsSubmittingTopic(false); }
    };


    // --- AUTH LOGIC ---
    const handleLogin = async (e) => {
        e.preventDefault(); setIsLoading(true); setError(null); setMessage(null);
        try {
            const response = await api.post('/api/auth/login', { username, password }); const token = response.data.token;
            let isAdmin = false;
            try { const payload = JSON.parse(atob(token.split('.')[1])); const roles = payload.roles || payload.authorities || []; isAdmin = roles.includes('ROLE_ADMIN'); }
            catch (decodeError) { throw new Error("Invalid token."); }
            if (isAdmin) { localStorage.setItem('adminToken', token); setIsAuthenticated(true); setMessage('Admin login successful!'); setUsername(''); setPassword(''); setActiveView('topics'); setError(''); }
            else { setError('Access denied. Admin role required.'); localStorage.removeItem('adminToken'); setIsAuthenticated(false); }
        } catch (err) { console.error("Login error", err); handleApiError(err, 'Login failed.'); localStorage.removeItem('adminToken'); setIsAuthenticated(false); }
        finally { setIsLoading(false); }
    };

    // --- RENDER FUNCTIONS ---

    // --- Login Form ---
    const renderLogin = () => (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>
                {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm text-center mb-4">{error}</p>}
                {message && <p className="text-green-600 bg-green-100 p-3 rounded-md text-sm text-center mb-4">{message}</p>}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="usernameL" className="block text-gray-700 text-sm font-semibold mb-2">Username:</label>
                        <input type="text" id="usernameL" value={username} onChange={(e) => setUsername(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="passwordL" className="block text-gray-700 text-sm font-semibold mb-2">Password:</label>
                        <input type="password" id="passwordL" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center min-h-[40px]">
                        {isLoading ? <LoadingSpinner /> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );

    // --- Add/Edit Question Form ---
    const renderAddEditForm = () => (
        <div ref={formRef} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">{questionId ? `Edit Question (Topic: ${topic})` : (topic ? `Add New Question to ${topic}`: 'Add New Question & Topic')}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="topic" className="block text-gray-700 text-sm font-semibold mb-1.5">Topic:</label>
                    <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder="e.g., Java, History" required disabled={!!questionId || (activeView === 'questions' && !!selectedManageTopic)} />
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-semibold mb-1.5">Question Image URL (Optional):</label>
                    <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="https://..."/>
                </div>
                <div>
                    <label htmlFor="questionText" className="block text-gray-700 text-sm font-semibold mb-1.5">Question:</label>
                    <textarea id="questionText" value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary h-24 resize-y" placeholder="Enter question text" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[ {key: 'A', value: optionA, setter: setOptionA}, {key: 'B', value: optionB, setter: setOptionB}, {key: 'C', value: optionC, setter: setOptionC}, {key: 'D', value: optionD, setter: setOptionD} ].map(opt => (
                        <div key={opt.key}>
                            <label htmlFor={`option${opt.key}`} className="block text-gray-700 text-sm font-semibold mb-1.5">Option {opt.key}:</label>
                            <input type="text" id={`option${opt.key}`} value={opt.value} onChange={(e) => opt.setter(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder={`Answer ${opt.key}`} required />
                        </div>
                    ))}
                </div>
                <div>
                    <label htmlFor="correctAnswer" className="block text-gray-700 text-sm font-semibold mb-1.5">Correct Answer:</label>
                    <select id="correctAnswer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                    <button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center min-h-[40px]">
                        {isLoading ? <LoadingSpinner /> : (questionId ? 'Save Changes' : 'Add Question')}
                    </button>
                    <button type="button" onClick={() => { setActiveView(selectedManageTopic ? 'questions' : 'topics'); setMessage(''); setError(''); clearForm(); }} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    // --- Manage Topics View ---
    const renderTopicsView = () => (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-gray-800">Manage Topics</h2>
                <button onClick={handleAddQuestionNewTopic} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out flex items-center">
                    <AddIcon /> New Question
                </button>
            </div>
            {isLoadingTopics && <div className="flex justify-center py-10"><LoadingSpinner /></div>}
            {error && !isLoadingTopics && uniqueTopics.length === 0 && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm text-center my-4">{error}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {!isLoadingTopics && uniqueTopics.length > 0 ? (
                    uniqueTopics.map(t => (
                        <div key={t.name} className="relative group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                            <button
                                onClick={() => { setSelectedManageTopic(t.name); setActiveView('questions'); setMessage(''); setError(''); }}
                                className="w-full flex flex-col items-center justify-center p-4 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                            >
                                <div className="w-14 h-14 mb-2 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 border group-hover:bg-indigo-50">
                                    {t.logoUrl ? (
                                        <img src={t.logoUrl} alt={`${t.name} logo`} className="w-full h-full object-cover" onError={(e) => { const parent = e.target.parentElement; if(parent) parent.innerHTML = '<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>'; }} />
                                    ) : (
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 text-center capitalize break-words">{t.name || 'General'}</span>
                            </button>
                            <button onClick={() => handleOpenTopicEditModal(t)} title="Edit Topic Info" className="absolute top-1.5 right-1.5 p-1 bg-gray-200 rounded-full text-gray-600 hover:bg-primary-light hover:text-primary-dark focus:outline-none opacity-0 group-hover:opacity-100 transition-all duration-150 ease-in-out">
                                <EditIcon />
                            </button>
                        </div>
                    ))
                ) : (!isLoadingTopics && uniqueTopics.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">No topics found. Add a question to create one.</p>)}
            </div>
        </div>
    );

    // Calculate filtered questions at the top level of the component
    const filteredQuestions = useMemo(() => {
        if (activeView !== 'questions') return [];
        if (!selectedManageTopic) return allQuestions; // "All Questions" view
        return allQuestions.filter(q => q.topic === selectedManageTopic);
    }, [selectedManageTopic, allQuestions, activeView]);


    // --- Manage Questions View ---
    const renderQuestionsView = () => {
        const viewTitle = selectedManageTopic ? `Questions for: ${selectedManageTopic}` : "All Questions";
        const isAllQuestionsView = !selectedManageTopic;

        return (
            <div>
                <div className="flex justify-between items-center mb-5">
                    <div>
                        {selectedManageTopic && (
                            <button onClick={() => { setActiveView('topics'); setSelectedManageTopic(null); }} className="text-sm text-primary hover:text-primary-dark font-medium mb-1 inline-flex items-center transition-colors">
                                <ArrowLeftIcon/> Back to Topics
                            </button>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800 capitalize">{viewTitle}</h2>
                    </div>
                    <button
                        onClick={() => handleAddQuestionToTopic(selectedManageTopic)}
                        disabled={isAllQuestionsView}
                        className={`bg-primary text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                            isAllQuestionsView ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                        }`}
                        title={isAllQuestionsView ? "Select a topic first to add a question" : "Add Question to this Topic"}
                    >
                        <AddIcon /> Add Question
                    </button>
                </div>

                {isLoadingQuestions && <div className="flex justify-center py-10"><LoadingSpinner /></div>}
                {error && !isLoadingQuestions && activeView === 'questions' && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm text-center my-4">{error}</p>}

                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            {isAllQuestionsView && (
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                            )}
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Text</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {!isLoadingQuestions && filteredQuestions.length === 0 && activeView === 'questions' ? (
                            <tr><td colSpan={isAllQuestionsView ? 4 : 3} className="text-center py-10 text-gray-500">
                                {isAllQuestionsView ? "No questions found in the database." : "No questions found for this topic yet."}
                            </td></tr>
                        ) : (
                            filteredQuestions.map((q, index) => (
                                <tr key={q.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}>
                                    {isAllQuestionsView && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{q.topic || 'N/A'}</td>
                                    )}
                                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-md truncate" title={q.questionText}>{q.questionText ? `${q.questionText.substring(0, 100)}${q.questionText.length > 100 ? '...' : ''}` : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{q.imageUrl ? <span title={q.imageUrl} className="text-green-600 font-bold">✓ Yes</span> : <span className="text-gray-400">✗ No</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-3">
                                        <button onClick={() => handleEditClick(q)} className="text-primary hover:text-primary-dark font-semibold text-xs inline-flex items-center transition-colors" title="Edit Question">
                                            <EditIcon /> <span className="ml-1">Edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(q.id, q.topic)} className="text-red-600 hover:text-red-800 font-semibold text-xs inline-flex items-center transition-colors" title="Delete Question">
                                            <DeleteIcon /> <span className="ml-1">Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        {isLoadingQuestions && (
                            <tr><td colSpan={isAllQuestionsView ? 4 : 3}><LoadingSpinner /></td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // --- Topic Edit Modal ---
    const renderTopicEditModal = () => {
        if (!showTopicEditModal || !editingTopicInfo) return null;
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-150">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize border-b pb-2">Edit Info: {editingTopicInfo.name}</h3>
                    <form onSubmit={handleUpdateTopicInfo} className="space-y-4">
                        <div>
                            <label htmlFor="modalTopicName" className="block text-gray-700 text-sm font-semibold mb-1">Topic Name:</label>
                            <input type="text" id="modalTopicName" value={editingTopicInfo.name} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100 cursor-not-allowed" readOnly disabled />
                            <p className="text-xs text-gray-500 mt-1">Changing the topic name requires manual data migration.</p>
                        </div>
                        <div>
                            <label htmlFor="modalTopicLogoUrl" className="block text-gray-700 text-sm font-semibold mb-1">Topic Logo URL:</label>
                            <input type="url" id="modalTopicLogoUrl" value={modalTopicLogoUrl} onChange={(e) => setModalTopicLogoUrl(e.target.value)} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="https://..."/>
                            <p className="text-xs text-gray-500 mt-1">Leave blank to remove logo.</p>
                        </div>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button type="button" onClick={() => setShowTopicEditModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-sm hover:bg-gray-300 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">Cancel</button>
                            <button type="submit" disabled={isSubmittingTopic} className="px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center min-w-[80px]">
                                {isSubmittingTopic ? <LoadingSpinner /> : 'Save Logo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // --- Title Rewards View ---
    const renderTitleRewardsView = () => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Column */}
                <div className="lg:col-span-1" ref={titleFormRef}>
                    <form onSubmit={handleTitleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                            {editingTitleId ? 'Edit Title Reward' : 'Create Title Reward'}
                        </h3>
                        <div>
                            <label htmlFor="topic" className="block text-gray-700 text-sm font-semibold mb-1.5">Topic:</label>
                            <input
                                type="text"
                                id="topic"
                                name="topic"
                                value={titleForm.topic}
                                onChange={handleTitleFormChange}
                                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g., Java"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="levelRequired" className="block text-gray-700 text-sm font-semibold mb-1.5">Level Required:</label>
                            <input
                                type="number"
                                id="levelRequired"
                                name="levelRequired"
                                value={titleForm.levelRequired}
                                onChange={handleTitleFormChange}
                                min="1"
                                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-1.5">Title to Award:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={titleForm.title}
                                onChange={handleTitleFormChange}
                                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g., Java Slinger"
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmittingTitle}
                                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center min-h-[40px]"
                            >
                                {isSubmittingTitle ? <LoadingSpinner /> : (editingTitleId ? 'Update Reward' : 'Create Reward')}
                            </button>
                            {editingTitleId && (
                                <button
                                    type="button"
                                    onClick={clearTitleForm}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Column */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5">Existing Title Rewards</h2>
                    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {isLoadingTitles ? (
                                <tr><td colSpan="4"><div className="flex justify-center py-10"><LoadingSpinner /></div></td></tr>
                            ) : titleRewards.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-10 text-gray-500">No title rewards found. Create one to get started!</td></tr>
                            ) : (
                                titleRewards.sort((a, b) => a.topic.localeCompare(b.topic) || a.levelRequired - b.levelRequired)
                                    .map((reward, index) => (
                                        <tr key={reward.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{reward.topic}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reward.levelRequired}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reward.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-3">
                                                <button onClick={() => handleTitleEditClick(reward)} className="text-primary hover:text-primary-dark font-semibold text-xs inline-flex items-center transition-colors" title="Edit Reward">
                                                    <EditIcon /> <span className="ml-1">Edit</span>
                                                </button>
                                                <button onClick={() => handleTitleDelete(reward.id)} className="text-red-600 hover:text-red-800 font-semibold text-xs inline-flex items-center transition-colors" title="Delete Reward">
                                                    <DeleteIcon /> <span className="ml-1">Delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };


    // --- Main App Render Logic ---
    if (!isAuthenticated) return renderLogin();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-gray-200 flex flex-col fixed inset-y-0 left-0 z-10 shadow-lg">
                <div className="p-4 border-b border-gray-700 flex items-center justify-center h-16">
                    <span className="text-xl font-bold text-white tracking-tight">Quiz Admin Panel</span>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <button
                        onClick={() => { setActiveView('topics'); }}
                        className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-light ${
                            activeView === 'topics' ? 'bg-gray-700 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <TopicsIcon /> Topics
                    </button>
                    <button
                        onClick={() => { setActiveView('questions'); setSelectedManageTopic(null); }}
                        className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-light ${
                            (activeView === 'questions' || activeView === 'add_edit_form') ? 'bg-gray-700 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <QuestionsIcon /> All Questions
                    </button>
                    <button
                        onClick={() => { setActiveView('titles'); }}
                        className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-light ${
                            activeView === 'titles' ? 'bg-gray-700 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <TrophyIcon /> Title Rewards
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors duration-150">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-6 sm:p-8 overflow-y-auto">
                {message && <p className="p-3 bg-green-100 text-green-800 rounded-md text-sm mb-5 border border-green-200 shadow-sm">{message}</p>}
                {error && <p className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-5 border border-red-200 shadow-sm">{error}</p>}

                {/* Conditional Content based on activeView */}
                {activeView === 'topics' && renderTopicsView()}
                {activeView === 'questions' && renderQuestionsView()}
                {activeView === 'add_edit_form' && renderAddEditForm()}
                {activeView === 'titles' && renderTitleRewardsView()}

            </main>

            {renderTopicEditModal()}
        </div>
    );
}

export default App;