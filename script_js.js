// Roadmap data structure - One sprint per skill for maximum agility
let roadmapData = [
    // Core Skills - User can reorder as needed
    {
        id: 1,
        sprint: "Sprint 1",
        skill: "Linux Fundamentals",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 1
    },
    {
        id: 2,
        sprint: "Sprint 2", 
        skill: "Hadoop Ecosystem",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 2
    },
    {
        id: 3,
        sprint: "Sprint 3",
        skill: "Docker Containerization",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 3
    },
    {
        id: 4,
        sprint: "Sprint 4",
        skill: "Git & GitHub",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 4
    },
    {
        id: 5,
        sprint: "Sprint 5",
        skill: "Python for Data Engineering",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 5
    },
    {
        id: 6,
        sprint: "Sprint 6",
        skill: "SQL & Database Design",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 6
    },
    {
        id: 7,
        sprint: "Sprint 7",
        skill: "Database Advanced Topics",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 7
    },
    {
        id: 8,
        sprint: "Sprint 8",
        skill: "Data Warehousing",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 8
    },
    {
        id: 9,
        sprint: "Sprint 9",
        skill: "Apache Airflow",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: 9
    }
];

// Local storage key for persistence
const STORAGE_KEY = 'data_engineering_roadmap_progress';

// Initialize the application
function initializeApp() {
    console.log('Initializing app...');
    loadFromLocalStorage();
    setDefaultDates();
    renderTable();
    updateStatistics();
    enableDragAndDrop();
}

// Set default dates (2-week sprints starting from today)
function setDefaultDates() {
    const today = new Date();
    
    roadmapData.forEach((item, index) => {
        if (!item.startDate) {
            const startDate = new Date(today);
            startDate.setDate(today.getDate() + (index * 14)); // Each sprint starts 2 weeks after previous
            
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 13); // 2-week sprint (14 days)
            
            item.startDate = startDate.toISOString().split('T')[0];
            item.endDate = endDate.toISOString().split('T')[0];
        }
    });
}

// Load data from local storage
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.roadmapData && Array.isArray(parsedData.roadmapData)) {
                roadmapData = parsedData.roadmapData;
                console.log('Loaded data from local storage');
            }
        }
    } catch (error) {
        console.error('Error loading from local storage:', error);
    }
}

// Save data to local storage
function saveToLocalStorage() {
    try {
        const dataToSave = {
            roadmapData: roadmapData,
            lastUpdated: new Date().toISOString(),
            version: '2.0'
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('Saved data to local storage');
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
}

// Enable drag and drop functionality
function enableDragAndDrop() {
    const tbody = document.getElementById('roadmap-body');
    if (!tbody) return;

    let draggedRow = null;

    tbody.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'TR') {
            draggedRow = e.target;
            e.target.style.opacity = '0.5';
        }
    });

    tbody.addEventListener('dragend', function(e) {
        if (e.target.tagName === 'TR') {
            e.target.style.opacity = '';
            draggedRow = null;
        }
    });

    tbody.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    tbody.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedRow && e.target.tagName === 'TR' && e.target !== draggedRow) {
            const draggedIndex = parseInt(draggedRow.dataset.index);
            const targetIndex = parseInt(e.target.dataset.index);
            
            // Swap items in the array
            [roadmapData[draggedIndex], roadmapData[targetIndex]] = [roadmapData[targetIndex], roadmapData[draggedIndex]];
            
            // Update sprint numbers
            roadmapData.forEach((item, index) => {
                item.sprint = `Sprint ${index + 1}`;
                item.priority = index + 1;
            });
            
            renderTable();
            updateStatistics();
            saveToLocalStorage();
            
            // Show feedback
            showNotification('Sprints reordered successfully! 🔄');
        }
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Render the main table
function renderTable() {
    console.log('Rendering table...');
    const tbody = document.getElementById('roadmap-body');
    if (!tbody) {
        console.error('Table body not found');
        return;
    }
    
    tbody.innerHTML = '';

    roadmapData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.draggable = true;
        row.dataset.index = index;
        row.style.cursor = 'move';
        
        row.innerHTML = `
            <td class="sprint-cell">
                <div class="sprint-info">
                    <span class="sprint-number">${item.sprint}</span>
                    <span class="drag-handle">⋮⋮</span>
                </div>
            </td>
            <td class="skill-cell">
                <input type="text" class="skill-input" value="${item.skill}" 
                       onchange="updateField(${index}, 'skill', this.value)"
                       placeholder="Enter skill name...">
            </td>
            <td class="date-cell">
                <input type="date" class="date-input" value="${item.startDate}" 
                       onchange="updateDateField(${index}, 'startDate', this.value)">
            </td>
            <td class="date-cell">
                <input type="date" class="date-input" value="${item.endDate}" 
                       onchange="updateDateField(${index}, 'endDate', this.value)">
            </td>
            <td>
                <select class="status-select" onchange="updateStatus(${index}, this.value)">
                    <option value="Not Started" ${item.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                    <option value="In Progress" ${item.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
            <td>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${item.progress}%"></div>
                        <div class="progress-text">${item.progress}%</div>
                    </div>
                    <input type="range" class="progress-slider" min="0" max="100" value="${item.progress}" 
                           onchange="updateProgress(${index}, this.value)">
                </div>
            </td>
            <td class="rating-container">
                <div class="rating" onclick="setRating(${index}, 'ratingBefore', event)">
                    ${generateStars(item.ratingBefore)}
                </div>
            </td>
            <td class="rating-container">
                <div class="rating" onclick="setRating(${index}, 'ratingAfter', event)">
                    ${generateStars(item.ratingAfter)}
                </div>
            </td>
            <td>
                <textarea class="text-input" placeholder="List concepts you've mastered..." 
                          onchange="updateField(${index}, 'conceptsUnderstood', this.value)">${item.conceptsUnderstood}</textarea>
            </td>
            <td>
                <textarea class="text-input" placeholder="List concepts you need help with..." 
                          onchange="updateField(${index}, 'conceptsNeedHelp', this.value)">${item.conceptsNeedHelp}</textarea>
            </td>
            <td>
                <input type="text" class="remarks-input" value="${item.remarks}" 
                       onchange="updateField(${index}, 'remarks', this.value)"
                       placeholder="Add your personal comments...">
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Generate star rating display
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? '' : 'empty'}" data-star="${i}">★</span>`;
    }
    return stars;
}

// Set rating for a skill
function setRating(index, ratingType, event) {
    const starElement = event.target;
    if (starElement.classList.contains('star')) {
        const rating = parseInt(starElement.getAttribute('data-star'));
        roadmapData[index][ratingType] = rating;
        
        // Update the visual stars
        const ratingContainer = starElement.parentElement;
        ratingContainer.innerHTML = generateStars(rating);
        
        updateStatistics();
        saveToLocalStorage();
    }
}

// Update status
function updateStatus(index, value) {
    roadmapData[index].status = value;
    updateStatistics();
    saveToLocalStorage();
}

// Update progress
function updateProgress(index, value) {
    const progressValue = parseInt(value);
    roadmapData[index].progress = progressValue;
    
    // Update visual progress bar
    const row = document.querySelector(`#roadmap-body tr:nth-child(${index + 1})`);
    if (row) {
        const progressFill = row.querySelector('.progress-fill');
        const progressText = row.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = progressValue + '%';
            progressText.textContent = progressValue + '%';
        }
    }
    
    updateStatistics();
    saveToLocalStorage();
}

// Update date field and auto-calculate end date if start date changes
function updateDateField(index, field, value) {
    roadmapData[index][field] = value;
    
    // Auto-calculate end date when start date changes (2-week sprint)
    if (field === 'startDate' && value) {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 13); // 2-week sprint
        
        roadmapData[index].endDate = endDate.toISOString().split('T')[0];
        
        // Update the end date input
        const row = document.querySelector(`#roadmap-body tr:nth-child(${index + 1})`);
        if (row) {
            const endDateInput = row.querySelectorAll('.date-input')[1];
            if (endDateInput) {
                endDateInput.value = roadmapData[index].endDate;
            }
        }
    }
    
    saveToLocalStorage();
}

// Update field value
function updateField(index, field, value) {
    roadmapData[index][field] = value;
    saveToLocalStorage();
}

// Add new sprint
function addNewSprint() {
    const newSprint = {
        id: Date.now(),
        sprint: `Sprint ${roadmapData.length + 1}`,
        skill: "",
        startDate: "",
        endDate: "",
        status: "Not Started",
        progress: 0,
        ratingBefore: 0,
        ratingAfter: 0,
        conceptsUnderstood: "",
        conceptsNeedHelp: "",
        remarks: "",
        priority: roadmapData.length + 1
    };
    
    roadmapData.push(newSprint);
    setDefaultDates();
    renderTable();
    updateStatistics();
    saveToLocalStorage();
    showNotification('New sprint added! 🎯');
}

// Remove sprint
function removeSprint(index) {
    if (roadmapData.length <= 1) {
        alert('Cannot remove the last remaining sprint!');
        return;
    }
    
    if (confirm('Are you sure you want to remove this sprint?')) {
        roadmapData.splice(index, 1);
        
        // Renumber remaining sprints
        roadmapData.forEach((item, idx) => {
            item.sprint = `Sprint ${idx + 1}`;
            item.priority = idx + 1;
        });
        
        renderTable();
        updateStatistics();
        saveToLocalStorage();
        showNotification('Sprint removed! 🗑️');
    }
}

// Update statistics
function updateStatistics() {
    const totalProgress = roadmapData.reduce((sum, item) => sum + item.progress, 0);
    const overallProgress = Math.round(totalProgress / roadmapData.length);
    
    const completedSprints = roadmapData.filter(item => item.status === 'Completed').length;
    const inProgressSprints = roadmapData.filter(item => item.status === 'In Progress').length;
    
    const avgRatingBefore = roadmapData.reduce((sum, item) => sum + item.ratingBefore, 0) / roadmapData.length;
    const avgRatingAfter = roadmapData.reduce((sum, item) => sum + item.ratingAfter, 0) / roadmapData.length;
    
    // Update overall progress
    const progressFill = document.getElementById('overall-progress-fill');
    const progressText = document.getElementById('overall-progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = overallProgress + '%';
        progressText.textContent = overallProgress + '%';
    }
    
    // Update statistics cards
    const completedElement = document.getElementById('completed-sprints');
    const inProgressElement = document.getElementById('in-progress-sprints');
    const avgBeforeElement = document.getElementById('avg-rating-before');
    const avgAfterElement = document.getElementById('avg-rating-after');
    
    if (completedElement) completedElement.textContent = completedSprints;
    if (inProgressElement) inProgressElement.textContent = inProgressSprints;
    if (avgBeforeElement) avgBeforeElement.textContent = avgRatingBefore.toFixed(1);
    if (avgAfterElement) avgAfterElement.textContent = avgRatingAfter.toFixed(1);
}

// Export to CSV (Excel compatible)
function exportToCSV() {
    try {
        console.log('Exporting to CSV...');
        
        // Create CSV header
        const headers = [
            'Sprint',
            'Skill/Technology',
            'Start Date',
            'End Date',
            'Status',
            'Progress (%)',
            'Rating Before (1-5)',
            'Rating After (1-5)',
            'Concepts Understood',
            'Concepts Need Help',
            'Personal Comments'
        ];
        
        // Convert data to CSV format
        const csvContent = [
            headers.join(','),
            ...roadmapData.map(item => [
                `"${item.sprint}"`,
                `"${item.skill}"`,
                `"${item.startDate}"`,
                `"${item.endDate}"`,
                `"${item.status}"`,
                item.progress,
                item.ratingBefore,
                item.ratingAfter,
                `"${item.conceptsUnderstood.replace(/"/g, '""')}"`,
                `"${item.conceptsNeedHelp.replace(/"/g, '""')}"`,
                `"${item.remarks.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, 'Data_Engineering_Roadmap_Progress.csv');
        } else {
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `Data_Engineering_Roadmap_Progress_${new Date().toISOString().split('T')[0]}.csv`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        
        showNotification('CSV file exported successfully! 📊');
        
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting file. Please try again.');
    }
}

// Save progress to JSON file
function saveProgress() {
    try {
        console.log('Saving progress...');
        
        const dataToSave = {
            roadmapData: roadmapData,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(dataToSave, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(dataBlob);
        link.href = url;
        link.download = `roadmap_progress_${new Date().toISOString().split('T')[0]}.json`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('Progress saved successfully! 💾');
        
    } catch (error) {
        console.error('Save error:', error);
        alert('Error saving progress. Please try again.');
    }
}

// Load progress from JSON file
function loadProgress() {
    console.log('Loading progress...');
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.click();
    } else {
        alert('File input not found. Please refresh the page.');
    }
}

// Reset tracker to initial state
function resetTracker() {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
        // Reset all data to initial state
        roadmapData.forEach(item => {
            item.status = 'Not Started';
            item.progress = 0;
            item.ratingBefore = 0;
            item.ratingAfter = 0;
            item.conceptsUnderstood = '';
            item.conceptsNeedHelp = '';
            item.remarks = '';
        });
        
        // Reset dates
        setDefaultDates();
        
        // Clear local storage
        localStorage.removeItem(STORAGE_KEY);
        
        // Re-render everything
        renderTable();
        updateStatistics();
        
        showNotification('Tracker has been reset to initial state! 🔄');
    }
}

// Handle file input for loading progress
function setupFileInput() {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const loadedData = JSON.parse(e.target.result);
                        
                        if (loadedData.roadmapData && Array.isArray(loadedData.roadmapData)) {
                            // Replace current data with loaded data
                            roadmapData = loadedData.roadmapData;
                            
                            // Save to local storage
                            saveToLocalStorage();
                            
                            // Re-render everything
                            renderTable();
                            updateStatistics();
                            
                            showNotification('Progress loaded successfully! 📂');
                        } else {
                            alert('Invalid file format. Please select a valid progress file.');
                        }
                    } catch (error) {
                        console.error('Load error:', error);
                        alert('Error loading file. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
            
            // Reset file input
            event.target.value = '';
        });
    }
}

// Auto-save functionality
function enableAutoSave() {
    // Save progress every 30 seconds
    setInterval(() => {
        saveToLocalStorage();
    }, 30000);
}

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializeApp();
    setupFileInput();
    enableAutoSave();
});

// Fallback initialization
window.addEventListener('load', function() {
    console.log('Window Loaded');
    if (!document.getElementById('roadmap-body').hasChildNodes()) {
        initializeApp();
        setupFileInput();
    }
});