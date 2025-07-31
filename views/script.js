// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
let currentUser = null;
let currentPage = 1;
let currentFilters = {};

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboardData();
});

// Initialize application
function initializeApp() {
    // Check for stored authentication token
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Redirect to login or show login form
        showLoginForm();
        return;
    }
    
    // Set current user from token or localStorage
    currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"role": "Manager"}');
    document.getElementById('userRole').textContent = currentUser.role;
    
    // Load initial data
    loadFacilitators();
    loadCourseAllocations();
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Form submissions
    document.getElementById('createLogForm').addEventListener('submit', handleCreateLog);
    document.getElementById('editLogForm').addEventListener('submit', handleEditLog);
    
    // Filter changes
    document.getElementById('facilitatorFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    
    // Refresh button
    document.getElementById('refreshLogs').addEventListener('click', loadActivityLogs);
    
    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('editModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    // Load tab-specific data
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'activity-logs':
            loadActivityLogs();
            break;
        case 'reports':
            loadReportsData();
            break;
    }
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    if (finalOptions.body && typeof finalOptions.body === 'object') {
        finalOptions.body = JSON.stringify(finalOptions.body);
    }
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    } finally {
        hideLoading();
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const [logsData, facilitatorsData] = await Promise.all([
            apiRequest('/activity-logs'),
            apiRequest('/facilitators')
        ]);
        
        updateDashboardStats(logsData.data, facilitatorsData.data);
        loadRecentActivity(logsData.data);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboardStats(logs, facilitators) {
    const totalLogs = logs.length;
    const completedLogs = logs.filter(log => 
        log.attendance === 'Done' && 
        log.formativeOneGrading === 'Done' && 
        log.summativeGrading === 'Done'
    ).length;
    const pendingLogs = logs.filter(log => 
        log.attendance === 'Pending' || 
        log.formativeOneGrading === 'Pending' || 
        log.summativeGrading === 'Pending'
    ).length;
    const activeFacilitators = facilitators.filter(f => f.isActive).length;
    
    document.getElementById('totalLogs').textContent = totalLogs;
    document.getElementById('completedLogs').textContent = completedLogs;
    document.getElementById('pendingLogs').textContent = pendingLogs;
    document.getElementById('activeFacilitators').textContent = activeFacilitators;
}

function loadRecentActivity(logs) {
    const recentLogs = logs
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);
    
    const activityList = document.getElementById('recentActivityList');
    activityList.innerHTML = '';
    
    if (recentLogs.length === 0) {
        activityList.innerHTML = '<p class="text-muted">No recent activity</p>';
        return;
    }
    
    recentLogs.forEach(log => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-info">
                <div class="activity-title">Week ${log.weekNumber} - ${log.CourseOffering?.Module?.name || 'Unknown Course'}</div>
                <div class="activity-meta">
                    ${log.CourseOffering?.Facilitator?.firstName} ${log.CourseOffering?.Facilitator?.lastName} • 
                    ${formatDate(log.updatedAt)}
                </div>
            </div>
            <div class="activity-status">
                ${getOverallStatus(log)}
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// Activity Logs Functions
async function loadActivityLogs(page = 1) {
    try {
        currentPage = page;
        const queryParams = new URLSearchParams({
            page: page,
            limit: 10,
            ...currentFilters
        });
        
        const response = await apiRequest(`/activity-logs?${queryParams}`);
        displayActivityLogs(response.data);
        updatePagination(response.meta);
    } catch (error) {
        console.error('Error loading activity logs:', error);
    }
}

function displayActivityLogs(logs) {
    const tbody = document.getElementById('activityTableBody');
    tbody.innerHTML = '';
    
    if (logs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center">No activity logs found</td>
            </tr>
        `;
        return;
    }
    
    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.weekNumber}</td>
            <td>${log.CourseOffering?.Facilitator?.firstName} ${log.CourseOffering?.Facilitator?.lastName}</td>
            <td>${log.CourseOffering?.Module?.name}</td>
            <td>${getStatusBadge(log.attendance)}</td>
            <td>${getStatusBadge(log.formativeOneGrading)}</td>
            <td>${getStatusBadge(log.formativeTwoGrading)}</td>
            <td>${getStatusBadge(log.summativeGrading)}</td>
            <td>${getStatusBadge(log.courseModeration)}</td>
            <td>${getStatusBadge(log.intranetSync)}</td>
            <td>${getStatusBadge(log.gradeBookStatus)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editLog(${log.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteLog(${log.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getStatusBadge(status) {
    if (!status) return '<span class="status-badge status-not-started">Not Set</span>';
    
    const statusClass = status.toLowerCase().replace(' ', '-');
    return `<span class="status-badge status-${statusClass}">${status}</span>`;
}

function getOverallStatus(log) {
    const statuses = [
        log.attendance,
        log.formativeOneGrading,
        log.formativeTwoGrading,
        log.summativeGrading,
        log.courseModeration,
        log.intranetSync,
        log.gradeBookStatus
    ].filter(Boolean);
    
    if (statuses.every(s => s === 'Done')) {
        return '<span class="status-badge status-done">Complete</span>';
    } else if (statuses.some(s => s === 'Pending')) {
        return '<span class="status-badge status-pending">In Progress</span>';
    } else {
        return '<span class="status-badge status-not-started">Not Started</span>';
    }
}

// Form Functions
async function handleCreateLog(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const logData = Object.fromEntries(formData.entries());
    
    // Convert week number to integer
    logData.weekNumber = parseInt(logData.weekNumber);
    
    // Remove empty values
    Object.keys(logData).forEach(key => {
        if (logData[key] === '') {
            delete logData[key];
        }
    });
    
    try {
        await apiRequest('/activity-logs', {
            method: 'POST',
            body: logData
        });
        
        e.target.reset();
        switchTab('activity-logs');
    } catch (error) {
        console.error('Error creating activity log:', error);
    }
}

async function editLog(logId) {
    try {
        const response = await apiRequest(`/activity-logs/${logId}`);
        const log = response.data;
        
        // Populate edit form
        document.getElementById('editLogId').value = log.id;
        document.getElementById('editWeekNumber').value = log.weekNumber;
        document.getElementById('editAttendance').value = log.attendance || '';
        
        // Show modal
        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading log for edit:', error);
    }
}

async function handleEditLog(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const logData = Object.fromEntries(formData.entries());
    const logId = logData.id;
    delete logData.id;
    
    // Convert week number to integer
    logData.weekNumber = parseInt(logData.weekNumber);
    
    try {
        await apiRequest(`/activity-logs/${logId}`, {
            method: 'PUT',
            body: logData
        });
        
        closeModal();
        loadActivityLogs(currentPage);
    } catch (error) {
        console.error('Error updating activity log:', error);
    }
}

async function deleteLog(logId) {
    if (!confirm('Are you sure you want to delete this activity log?')) {
        return;
    }
    
    try {
        await apiRequest(`/activity-logs/${logId}`, {
            method: 'DELETE'
        });
        
        loadActivityLogs(currentPage);
    } catch (error) {
        console.error('Error deleting activity log:', error);
    }
}

// Filter Functions
function applyFilters() {
    const facilitatorId = document.getElementById('facilitatorFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    currentFilters = {};
    if (facilitatorId) currentFilters.facilitatorId = facilitatorId;
    if (status) currentFilters.status = status;
    
    loadActivityLogs(1);
}

// Data Loading Functions
async function loadFacilitators() {
    try {
        const response = await apiRequest('/facilitators');
        const facilitators = response.data;
        
        const select = document.getElementById('facilitatorFilter');
        select.innerHTML = '<option value="">All Facilitators</option>';
        
        facilitators.forEach(facilitator => {
            const option = document.createElement('option');
            option.value = facilitator.id;
            option.textContent = `${facilitator.firstName} ${facilitator.lastName}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading facilitators:', error);
    }
}

async function loadCourseAllocations() {
    try {
        const response = await apiRequest('/course-offerings');
        const allocations = response.data;
        
        const select = document.getElementById('allocationId');
        select.innerHTML = '<option value="">Select Course Allocation</option>';
        
        allocations.forEach(allocation => {
            const option = document.createElement('option');
            option.value = allocation.id;
            option.textContent = `${allocation.Module?.name} - ${allocation.Facilitator?.firstName} ${allocation.Facilitator?.lastName}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading course allocations:', error);
    }
}

// Reports Functions
async function loadReportsData() {
    try {
        const response = await apiRequest('/activity-logs');
        const logs = response.data;
        
        generateCharts(logs);
    } catch (error) {
        console.error('Error loading reports data:', error);
    }
}

function generateCharts(logs) {
    // Facilitator completion rate chart
    generateFacilitatorChart(logs);
    
    // Status distribution chart
    generateStatusChart(logs);
    
    // Weekly progress chart
    generateWeeklyChart(logs);
    
    // Course completion chart
    generateCourseChart(logs);
}

function generateFacilitatorChart(logs) {
    const ctx = document.getElementById('facilitatorChart').getContext('2d');
    
    // Group logs by facilitator
    const facilitatorData = {};
    logs.forEach(log => {
        const facilitatorName = `${log.CourseOffering?.Facilitator?.firstName} ${log.CourseOffering?.Facilitator?.lastName}`;
        if (!facilitatorData[facilitatorName]) {
            facilitatorData[facilitatorName] = { total: 0, completed: 0 };
        }
        facilitatorData[facilitatorName].total++;
        if (log.attendance === 'Done' && log.summativeGrading === 'Done') {
            facilitatorData[facilitatorName].completed++;
        }
    });
    
    const labels = Object.keys(facilitatorData);
    const completionRates = labels.map(name => 
        facilitatorData[name].total > 0 ? 
        (facilitatorData[name].completed / facilitatorData[name].total * 100).toFixed(1) : 0
    );
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completion Rate (%)',
                data: completionRates,
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function generateStatusChart(logs) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    const statusCounts = {
        'Done': 0,
        'Pending': 0,
        'Not Started': 0
    };
    
    logs.forEach(log => {
        const overallStatus = getOverallStatusText(log);
        statusCounts[overallStatus]++;
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(39, 174, 96, 0.8)',
                    'rgba(243, 156, 18, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(39, 174, 96, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function generateWeeklyChart(logs) {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    
    // Group logs by week
    const weeklyData = {};
    logs.forEach(log => {
        const week = log.weekNumber;
        if (!weeklyData[week]) {
            weeklyData[week] = { total: 0, completed: 0 };
        }
        weeklyData[week].total++;
        if (log.attendance === 'Done' && log.summativeGrading === 'Done') {
            weeklyData[week].completed++;
        }
    });
    
    const weeks = Object.keys(weeklyData).sort((a, b) => parseInt(a) - parseInt(b));
    const totalData = weeks.map(week => weeklyData[week].total);
    const completedData = weeks.map(week => weeklyData[week].completed);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(w => `Week ${w}`),
            datasets: [{
                label: 'Total Logs',
                data: totalData,
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4
            }, {
                label: 'Completed Logs',
                data: completedData,
                borderColor: 'rgba(39, 174, 96, 1)',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function generateCourseChart(logs) {
    const ctx = document.getElementById('courseChart').getContext('2d');
    
    // Group logs by course
    const courseData = {};
    logs.forEach(log => {
        const courseName = log.CourseOffering?.Module?.name || 'Unknown Course';
        if (!courseData[courseName]) {
            courseData[courseName] = { total: 0, completed: 0 };
        }
        courseData[courseName].total++;
        if (log.attendance === 'Done' && log.summativeGrading === 'Done') {
            courseData[courseName].completed++;
        }
    });
    
    const labels = Object.keys(courseData);
    const completionRates = labels.map(name => 
        courseData[name].total > 0 ? 
        (courseData[name].completed / courseData[name].total * 100).toFixed(1) : 0
    );
    
    new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completion Rate (%)',
                data: completionRates,
                backgroundColor: 'rgba(155, 89, 182, 0.8)',
                borderColor: 'rgba(155, 89, 182, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function getOverallStatusText(log) {
    const statuses = [
        log.attendance,
        log.formativeOneGrading,
        log.formativeTwoGrading,
        log.summativeGrading,
        log.courseModeration,
        log.intranetSync,
        log.gradeBookStatus
    ].filter(Boolean);
    
    if (statuses.every(s => s === 'Done')) {
        return 'Done';
    } else if (statuses.some(s => s === 'Pending')) {
        return 'Pending';
    } else {
        return 'Not Started';
    }
}

// Pagination Functions
function updatePagination(meta) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    if (meta.totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = meta.currentPage === 1;
    prevBtn.addEventListener('click', () => loadActivityLogs(meta.currentPage - 1));
    pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= meta.totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === meta.currentPage ? 'active' : '';
        pageBtn.addEventListener('click', () => loadActivityLogs(i));
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = meta.currentPage === meta.totalPages;
    nextBtn.addEventListener('click', () => loadActivityLogs(meta.currentPage + 1));
    pagination.appendChild(nextBtn);
}

// Utility Functions
function showLoading() {
    loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showLoginForm();
}

function showLoginForm() {
    // For demo purposes, we'll just set a mock token
    // In a real application, this would show a proper login form
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('currentUser', JSON.stringify({
        id: 1,
        role: 'Manager',
        firstName: 'Admin',
        lastName: 'User'
    }));
    location.reload();
}