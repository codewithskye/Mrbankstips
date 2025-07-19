// Global Variables
let currentSport = 'soccer';
let currentDate = 'today';
let matches = [];
let liveScores = [];

// DOM Elements
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const sportButtons = document.querySelectorAll('.sport-btn');
const dateButtons = document.querySelectorAll('.date-btn');
const matchesTableBody = document.getElementById('matches-tbody');
const liveScoresContainer = document.getElementById('live-scores');
const newsTicker = document.getElementById('news-ticker');
const assistantToggle = document.getElementById('assistant-toggle');
const assistantChat = document.getElementById('assistant-chat');
const closeChat = document.getElementById('close-chat');
const userInput = document.getElementById('user-input');
const sendMessage = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');

const API_FOOTBALL_KEY = '166f77723e28def182950832dab8336b';
const NEWS_API_KEY = 'c8dcacc5cc1b46cab8fd3dc3e0ec9d08';

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeLoader();
    initializeNavigation();
    initializeSportToggles();
    initializeDateFilters();
    initializeMatches();
    initializeLiveScores();
    initializeNewsTicker();
    initializeLatestNews();
    initializeAIAssistant();
    initializeScrollAnimations();
    initializeScrollEffects();
    initializeStorageListener();
    initializeFAQAccordion();
    initializeGreetingPopup();
});

// Loader Functions
function initializeLoader() {
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
            // Show greeting popup after loader finishes
            setTimeout(() => {
                showGreetingPopup();
            }, 500);
        }
    }, 3000);
}

// Navigation Functions
function initializeNavigation() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Make logo clickable
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Sport Toggle Functions
function initializeSportToggles() {
    sportButtons.forEach(button => {
        button.addEventListener('click', () => {
            sportButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSport = button.dataset.sport;
            loadMatches();
        });
    });
}

// Date Filter Functions
function initializeDateFilters() {
    dateButtons.forEach(button => {
        button.addEventListener('click', () => {
            dateButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentDate = button.dataset.date;
            loadMatches();
        });
    });
}

// Match Functions
function initializeMatches() {
    loadMatchesFromStorage();
    // Add sample matches if no matches exist
    if (matches.length === 0) {
        addSampleMatches();
    }
    loadMatches();
}

// Add sample matches, to be displayed on the index //
function addSampleMatches() {
    const sampleMatches = [

        {
            id: 'match1',
            sport: 'soccer',
            date: 'today',
            time: '17:00',
            home: 'Ilves',
            away: 'Shakhtar Donetsk',
            prediction: '2',
            score: '1:3',
            odds: '1.40',
            status: 'not-started'
        },
        {
            id: 'match2',
            sport: 'soccer',
            date: 'today',
            time: '17:00',
            home: 'FK Aktobe',
            away: 'Legia Warszawa',
            prediction: 'X2',
            score: '0:1',
            odds: '1.20',
            status: 'not-started'
        },
        {
            id: 'match3',
            sport: 'soccer',
            date: 'today',
            time: '18:00',
            home: 'BK Hacken',
            away: 'FC Spartak Trnava',
            prediction: '1X',
            score: '2:1',
            odds: '1.20',
            status: 'not-started'
        },
        {
            id: 'match4',
            sport: 'soccer',
            date: 'today',
            time: '18:30',
            home: 'CFR Cluj',
            away: 'Paksi FC',
            prediction: '1',
            score: '1:1',
            odds: '1.20',
            status: 'not-started'
        },
        {
            id: 'match5',
            sport: 'soccer',
            date: 'today',
            time: '19:00',
            home: 'FC Prishtina',
            away: 'Sheriff Tiraspol',
            prediction: 'X2',
            score: '1:3',
            odds: '1.35',
            status: 'not-started'
        },
        {
            id: 'match6',
            sport: 'soccer',
            date: 'today',
            time: '19:00',
            home: 'NK Celje',
            away: 'Sabah FK',
            prediction: '1X',
            score: '2:1',
            odds: '1.25',
            status: 'not-started'
        },
        {
            id: 'match7',
            sport: 'soccer',
            date: 'today',
            time: '19:00',
            home: "Hapoel Be'er Sheva",
            away: 'Levski Sofia',
            prediction: '1X',
            score: '1X',
            odds: '1.25',
            status: 'not-started'
        },
        {
            id: 'match8',
            sport: 'soccer',
            date: 'today',
            time: '20:00',
            home: 'FK Partizan',
            away: 'AEK Larnaca',
            prediction: 'X2',
            score: '0:1',
            odds: '1.30',
            status: 'not-started'
        }
    ];
    
    matches = sampleMatches;
    saveMatchesToStorage();
}

// Listen for localStorage changes
function initializeStorageListener() {
    window.addEventListener('storage', (event) => {
        if (event.key === 'adminMatches') {
            loadMatchesFromStorage();
            loadMatches();
        }
    });
}

// Load matches from localStorage
function loadMatchesFromStorage() {
    try {
        const savedMatches = localStorage.getItem('adminMatches');
        if (savedMatches) {
            matches = JSON.parse(savedMatches);
        } else {
            matches = [];
        }
    } catch (error) {
        console.error('Failed to load matches from storage:', error);
        matches = [];
    }
}

// Save matches to localStorage
function saveMatchesToStorage() {
    try {
        localStorage.setItem('adminMatches', JSON.stringify(matches));
    } catch (error) {
        console.error('Failed to save matches to storage:', error);
    }
}

// Function to get real-time date categories
function getDateCategory(matchDate) {
    const today = new Date();
    const match = new Date();
    const diffTime = today - match;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays >= 2 && diffDays <= 4) return '2days';
    return 'old';
}

// Function to load matches
function loadMatches() {
    if (!matchesTableBody) return;

    const filteredMatches = matches.filter(match => 
        match.sport === currentSport && match.date === currentDate
    );

    matchesTableBody.innerHTML = '';

    if (filteredMatches.length === 0) {
        const noMatchesRow = document.createElement('tr');
        noMatchesRow.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 3rem; color: #666;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                    <i class='bx bx-info-circle' style="font-size: 3rem; color: #4ade80;"></i>
                    <h3 style="margin: 0; color: #014421;">We are currently working on ${getSportDisplayName(currentSport)} picks</h3>
                    <p style="margin: 0; opacity: 0.8;">Our expert analysts are preparing the best predictions for you. Check back soon!</p>
                </div>
            </td>
        `;
        matchesTableBody.appendChild(noMatchesRow);
        return;
    }

    filteredMatches.forEach((match, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.1}s`;
        
        const statusClass = `status-${match.status.replace(' ', '-')}`;
        const statusText = match.status === 'not-started' ? 'Not Started' : 
                          match.status === 'live' ? 'Live' : 
                          `FT: ${match.score}`;

        row.innerHTML = `
            <td>${match.time}</td>
            <td><strong>${match.home}</strong></td>
            <td><strong>${match.away}</strong></td>
            <td><span class="prediction-badge">${match.prediction}</span></td>
            <td>${match.score}</td>
            <td>${match.odds}</td>
            <td><span class="match-status ${statusClass}">${statusText}</span></td>
        `;

        matchesTableBody.appendChild(row);
    });
}

// Helper function to get display name for sports
function getSportDisplayName(sport) {
    const sportNames = {
        'soccer': 'Soccer',
        'tennis': 'Tennis', 
        'basketball': 'Basketball'
    };
    return sportNames[sport] || sport;
}

// Live Scores Functions
function initializeLiveScores() {
    fetchLiveScores();
    setInterval(fetchLiveScores, 30000); // Update every 30 seconds
}

async function fetchLiveScores() {
    const liveScoresContainer = document.getElementById('live-scores');
    if (!liveScoresContainer) return;

    try {
        const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': API_FOOTBALL_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`API-Football request failed: ${response.status}`);
        }

        const data = await response.json();
        liveScores = data.response.map(match => ({
            home: match.teams.home.name,
            away: match.teams.away.name,
            score: `${match.goals.home ?? 0}-${match.goals.away ?? 0}`,
            time: match.fixture.status.short === 'FT' ? 'FT' : 
                  match.fixture.status.short === 'NS' ? 'Not Started' : 
                  `${match.fixture.status.elapsed}'`,
            league: match.league.name
        }));

        displayLiveScores();
    } catch (error) {
        console.error('Error fetching live scores:', error);
        liveScores = [];
        liveScoresContainer.innerHTML = `
            <div class="no-scores">
                <i class='bx bx-error-circle' style="font-size: 3rem; color: #ef4444;"></i>
                <p>Unable to load live scores. Please try again later.</p>
            </div>
        `;
    }
}

function displayLiveScores() {
    if (!liveScoresContainer) return;

    liveScoresContainer.innerHTML = '';

    if (liveScores.length === 0) {
        liveScoresContainer.innerHTML = `
            <div class="no-scores">
                <i class='bx bx-info-circle' style="font-size: 3rem; color: #4ade80;"></i>
                <p>No live matches currently. Check back soon!</p>
            </div>
        `;
        return;
    }

    liveScores.forEach((score, index) => {
        const scoreCard = document.createElement('div');
        scoreCard.className = 'score-card fade-in';
        scoreCard.style.animationDelay = `${index * 0.2}s`;

        scoreCard.innerHTML = `
            <div class="match-teams">${score.home} vs ${score.away}</div>
            <div class="match-score">${score.score}</div>
            <div class="match-time">${score.time} - ${score.league}</div>
        `;

        liveScoresContainer.appendChild(scoreCard);
    });
}

// News Ticker Functions
function initializeNewsTicker() {
    fetchNewsTicker();
    setInterval(fetchNewsTicker, 30 * 60 * 1000); // Update every 30 minutes
}

async function fetchNewsTicker() {
    if (!newsTicker) return;

    newsTicker.innerHTML = `<span>Loading latest football news...</span>`;

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=football+OR+soccer+-cricket+-baseball&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`NewsAPI request failed: ${response.status}`);
        }

        const data = await response.json();
        if (!data.articles || data.articles.length === 0) {
            throw new Error('No articles found');
        }

        const headlines = data.articles.map(article => article.title || 'No Title');
        displayNews(headlines);
    } catch (error) {
        console.error('Error fetching news ticker:', error);
        newsTicker.innerHTML = `<span>Unable to load news. Please try again later.</span>`;
    }
}

function displayNews(headlines) {
    if (!newsTicker) return;

    const newsText = headlines.join(' • ');
    newsTicker.innerHTML = `<span>${newsText}</span>`;
}

// Latest News Functions
function initializeLatestNews() {
    fetchLatestFootballNews();
    setInterval(fetchLatestFootballNews, 30 * 60 * 1000); // Update every 30 minutes
}

async function fetchLatestFootballNews() {
    const newsGrid = document.getElementById('latest-news-grid');
    if (!newsGrid) return;

    newsGrid.innerHTML = `
        <div class="news-loading">
            <i class='bx bx-loader-alt bx-spin'></i>
            <p>Loading latest football news...</p>
        </div>
    `;

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=football+OR+soccer+-cricket+-baseball&language=en&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`NewsAPI request failed: ${response.status}`);
        }

        const data = await response.json();
        if (!data.articles || data.articles.length === 0) {
            throw new Error('No articles found');
        }

        displayLatestNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        displaySampleNews();
    }
}

function displayLatestNews(articles) {
    const newsGrid = document.getElementById('latest-news-grid');
    if (!newsGrid) return;

    newsGrid.innerHTML = '';

    articles.slice(0, 6).forEach((article, index) => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card fade-in';
        newsCard.style.animationDelay = `${index * 0.1}s`;

        const publishedDate = new Date(article.publishedAt);
        const timeAgo = getTimeAgo(publishedDate);
        const validImage = article.urlToImage && article.urlToImage.startsWith('http') ? article.urlToImage : '/api/placeholder/400/200';

        newsCard.innerHTML = `
            <div class="news-image">
                <img src="${validImage}" alt="${article.title || 'News Image'}" class="news-img" onerror="this.src='/api/placeholder/400/200'">
            </div>
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-source">${article.source?.name || 'Unknown Source'}</span>
                    <span class="news-timestamp">
                        <i class='bx bx-time'></i>
                        ${timeAgo}
                    </span>
                </div>
                <h3 class="news-title">${article.title || 'No Title'}</h3>
                <p class="news-description">${article.description || 'No description available.'}</p>
                <div class="news-footer">
                    <span class="news-timestamp">${publishedDate.toLocaleDateString()}</span>
                    <a href="${article.url || '#'}" target="_blank" class="news-link">Read More</a>
                </div>
            </div>
        `;

        newsGrid.appendChild(newsCard);
    });
}

function displaySampleNews() {
    const sampleNews = [
        {
            title: "Premier League Transfer Window Updates",
            description: "Latest transfer news and rumors from the Premier League as clubs prepare for the upcoming season.",
            source: { name: "Football News" },
            publishedAt: new Date().toISOString(),
            url: "#",
            urlToImage: "/api/placeholder/400/200"
        },
        {
            title: "Champions League Draw Results",
            description: "The Champions League group stage draw has been completed with exciting matchups ahead.",
            source: { name: "UEFA" },
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            url: "#",
            urlToImage: "/api/placeholder/400/200"
        },
        {
            title: "World Cup Qualifiers Recap",
            description: "Highlights and results from the latest World Cup qualifying matches around the globe.",
            source: { name: "FIFA" },
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            url: "#",
            urlToImage: "/api/placeholder/400/200"
        }
    ];

    displayLatestNews(sampleNews);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// AI Assistant Functions
function initializeAIAssistant() {
    if (!assistantToggle || !assistantChat) return;

    assistantToggle.addEventListener('click', () => {
        if (!assistantChat.classList.contains('active')) {
            chatMessages.innerHTML = '';
            const initialMessage = document.createElement('div');
            initialMessage.className = 'message bot-message';
            initialMessage.innerHTML = `<p>Greetings! Welcome to the Mrbanks website. I'm here to assist you with expert betting advice, bookmaker suggestions, and site guidance.</p>`;
            chatMessages.appendChild(initialMessage);
            
            setTimeout(() => {
                addFAQSuggestions();
            }, 500);
        }
        assistantChat.classList.toggle('active');
    });

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            assistantChat.classList.remove('active');
            chatMessages.innerHTML = '';
        });
    }

    if (sendMessage && userInput) {
        sendMessage.addEventListener('click', sendUserMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }
}

// FAQ Functionality

function initializeFAQAccordion() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = question.querySelector('i');

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    item.querySelector('.faq-question i').classList.remove('bx-minus');
                    item.querySelector('.faq-question i').classList.add('bx-plus');
                }
            });

            faqItem.classList.toggle('active');

            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.remove('bx-plus');
                icon.classList.add('bx-minus');
            } else {
                answer.style.maxHeight = null;
                icon.classList.remove('bx-minus');
                icon.classList.add('bx-plus');
            }
        });
    });
}

// FAQ Suggestions Panel
function addFAQSuggestions() {
    const faqContainer = document.createElement('div');
    faqContainer.className = 'faq-suggestions';
    faqContainer.innerHTML = `
        <div class="faq-title">Quick Questions:</div>
        <div class="faq-buttons">
            <button class="faq-btn" onclick="askFAQ('What is your success rate?')">What is your success rate?</button>
            <button class="faq-btn" onclick="askFAQ('How do I get started?')">How do I get started?</button>
            <button class="faq-btn" onclick="askFAQ('Which bookmakers do you recommend?')">Which bookmakers do you recommend?</button>
            <button class="faq-btn" onclick="askFAQ('What sports do you cover?')">What sports do you cover?</button>
            <button class="faq-btn" onclick="askFAQ('Do you offer premium?')">Do you offer premium?</button>
        </div>
    `;

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages && !chatMessages.querySelector('.faq-suggestions')) {
        chatMessages.appendChild(faqContainer); // Insert after the greeting message
    }
}

// Handle quick FAQ button click
window.askFAQ = function (question) {
    if (chatMessages) {
        addMessageToChat(question, 'user');
        setTimeout(() => {
            const response = generateBotResponse(question);
            addMessageToChat(response, 'bot');
        }, 500);
    }
};

// Handle user text input
function sendUserMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessageToChat(message, 'user');
    userInput.value = '';

    setTimeout(() => {
        const response = generateBotResponse(message);
        addMessageToChat(response, 'bot');
    }, 600);
}

// Add a message to the chat log
function addMessageToChat(message, sender) {
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Bot Responses Trained on Site Pages
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();

    if (message.includes('success rate')) {
        return "We proudly maintain a 95% success rate, validated by thousands of satisfied clients and transparently monitored on our platform.";
    }

    if (message.includes('start') || message.includes('how do i') || message.includes('get picks')) {
        return "You can begin by registering with our recommended bookmaker and joining our Telegram community for updates[](https://t.me/MrBanksFreeChannel).";
    }

    if (message.includes('bookmaker') || message.includes('where to bet')) {
        return "I recommend using Stake—sign up here[](http://stake.com/?c=f213c5ba25&offer=banks)—and SportyBet for your betting needs.";
    }

    if (message.includes('sports') || message.includes('which sports')) {
        return "We provide coverage for Football, Basketball, Tennis, and Horse Racing.";
    }

    if (message.includes('premium') || message.includes('cost') || message.includes('price') || message.includes('membership')) {
        return "No, all our tips are provided free of charge.";
    }

    if (message.includes('live') || message.includes('scores')) {
        return "Explore our Live Scores section for real-time match updates, refreshed every 30 seconds.";
    }

    if (message.includes('news')) {
        return "Stay informed with the latest updates by visiting the 'Latest News' section on our homepage.";
    }

    if (message.includes('about') || message.includes('who are you')) {
        return "We are MrbanksTips247, a team of seasoned experts offering professional sports betting advice with over five years of experience.";
    }

    if (message.includes('contact') || message.includes('support')) {
        return "Feel free to reach out via our Contact page or connect with us on WhatsApp, Telegram, or email—we’re available 24/7.";
    }

    if (message.includes('blog') || message.includes('strategies') || message.includes('tips')) {
        return "Discover valuable insights and previews by exploring our Blog, featuring expert betting strategies across all sports.";
    }

    return "I’m here to support you with betting guidance, site navigation, and more. Please feel free to ask anything!";
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.feature-card, .score-card, .blog-card, .hero-content, .hero-stats, .matches-section, .live-scores, .latest-news');
    animateElements.forEach((el, index) => {
        el.classList.add('animate-element');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Add smooth scroll behavior to hero section
    addHeroAnimations();
}

// Add hero animations
function addHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('hero-animated');
        
        // Add floating animation to hero elements
        const heroTitle = hero.querySelector('.hero-title');
        const heroSubtitle = hero.querySelector('.hero-subtitle');
        const heroButtons = hero.querySelector('.hero-buttons');
        
        if (heroTitle) heroTitle.classList.add('float-animation');
        if (heroSubtitle) heroSubtitle.classList.add('float-animation-delayed');
        if (heroButtons) heroButtons.classList.add('float-animation-delayed-2');
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Add smooth parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            // Subtle parallax effect
            const speed = scrolled * 0.3;
            heroContent.style.transform = `translateY(${speed}px)`;
            
            // Add opacity fade effect
            const opacity = Math.max(0, 1 - scrolled / (window.innerHeight * 0.8));
            heroContent.style.opacity = opacity;
        }
    });
    
    // Add scroll-triggered animations for sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-section');
    });
}

// Utility Functions
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function getRandomScore() {
    const home = Math.floor(Math.random() * 4);
    const away = Math.floor(Math.random() * 4);
    return `${home}-${away}`;
}

function getRandomOdds() {
    return (1.5 + Math.random() * 3).toFixed(2);
}

// Match Status Updates (simulated)
function updateMatchStatuses() {
    matches.forEach(match => {
        if (match.status === 'live' && Math.random() > 0.8) {
            match.status = 'finished';
            match.score = getRandomScore();
        } else if (match.status === 'not-started' && Math.random() > 0.9) {
            match.status = 'live';
            match.score = getRandomScore();
        }
    });
    
    saveMatchesToStorage();
    loadMatches();
}

// Update match statuses every minute
setInterval(updateMatchStatuses, 60000);

// Export functions for admin panel
window.addMatchFromAdmin = function(matchData) {
    matches.push(matchData);
    saveMatchesToStorage();
    loadMatches();
};

window.updateMatchFromAdmin = function(index, matchData) {
    if (matches[index]) {
        matches[index] = { ...matches[index], ...matchData };
        saveMatchesToStorage();
        loadMatches();
    }
};

window.deleteMatchFromAdmin = function(index) {
    if (matches[index]) {
        matches.splice(index, 1);
        saveMatchesToStorage();
        loadMatches();
    }
};

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Greeting Popup Functions
function initializeGreetingPopup() {
    // This function is called in the initialization but the popup is shown after loader
}

function showGreetingPopup() {
    const popup = document.createElement('div');
    popup.className = 'greeting-popup';
    popup.id = 'greetingPopup';
    
    const greeting = getTimeBasedGreeting();
    const quote = getRandomQuote();
    
    popup.innerHTML = `
        <div class="greeting-card">
            <button class="greeting-close" onclick="closeGreetingPopup()">
                <i class='bx bx-x'></i>
            </button>
            <div class="greeting-icon">
                <i class='bx bx-sun'></i>
            </div>
            <h2 class="greeting-title">${greeting}</h2>
            <p class="greeting-quote">"${quote.text}"</p>
            <p class="greeting-author">- ${quote.author}</p>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Animate in
    setTimeout(() => {
        popup.classList.add('active');
    }, 100);
}

function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    const greetingWords = ['Hero', 'Hustler', 'Champion', 'Winner', 'Legend'];
    const randomWord = greetingWords[Math.floor(Math.random() * greetingWords.length)];
    
    if (hour < 12) {
        return `Good Morning ${randomWord}!`;
    } else if (hour < 18) {
        return `Good Afternoon ${randomWord}!`;
    } else {
        return `Good Evening ${randomWord}!`;
    }
}

function getRandomQuote() {
    const quotes = [
        { text: "Success is where preparation and opportunity meet.", author: "Bobby Unser" },
        { text: "The harder you work, the luckier you get.", author: "Gary Player" },
        { text: "Champions are made when nobody's watching.", author: "Unknown" },
        { text: "Winning isn't everything, but wanting to win is.", author: "Vince Lombardi" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
}

window.closeGreetingPopup = function() {
    const popup = document.getElementById('greetingPopup');
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
};

document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e => {
    if (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
    }
    if (e.keyCode === 123) {
        e.preventDefault();
    }
});
