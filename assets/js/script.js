document.addEventListener('DOMContentLoaded', function() {
    const weekTabs = document.getElementById('weekTabs');
    const weekContent = document.getElementById('weekContent');
    const weekTemplate = document.getElementById('weekTemplate');

    // Fetch course data
    fetch('/assets/json/course-data.json')
        .then(response => response.json())
        .then(courseData => {
            // Create tabs and content for each week
            courseData.weeks.forEach((week, index) => {
                // Create tab
                const tabItem = document.createElement('li');
                tabItem.className = 'nav-item';
                tabItem.innerHTML = `
                    <button class="nav-link ${index === 0 ? 'active' : ''}" 
                            id="week${week.weekNumber}-tab" 
                            data-bs-toggle="tab" 
                            data-bs-target="#week${week.weekNumber}" 
                            type="button" 
                            role="tab">
                        Week ${week.weekNumber}
                    </button>
                `;
                weekTabs.appendChild(tabItem);

                // Create content
                const weekContent = createWeekContent(week, index === 0);
                document.getElementById('weekContent').appendChild(weekContent);
            });

            // Set course title and semester
            document.querySelector('.course-title').textContent = courseData.courseName;
            document.querySelector('.semester').textContent = courseData.semester;

            // Initialize Bootstrap tabs
            const tabElements = document.querySelectorAll('[data-bs-toggle="tab"]');
            tabElements.forEach(tab => {
                new bootstrap.Tab(tab);
            });
        })
        .catch(error => console.error('Error loading course data:', error));
});

function createWeekContent(week, isActive) {
    const template = document.getElementById('weekTemplate');
    const content = template.content.cloneNode(true);
    const tabPane = content.querySelector('.tab-pane');
    
    tabPane.id = `week${week.weekNumber}`;
    if (isActive) {
        tabPane.classList.add('show', 'active');
    }

    // Set week topic
    tabPane.querySelector('.week-topic').textContent = `Week ${week.weekNumber}: ${week.topic}`;

    // Add assignments
    const assignmentsList = tabPane.querySelector('.assignments-list');
    week.assignments.forEach(assignment => {
        const assignmentElement = createAssignmentElement(assignment);
        assignmentsList.appendChild(assignmentElement);
    });

    // Add activities
    const activitiesList = tabPane.querySelector('.activities-list');
    week.activities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        activitiesList.appendChild(activityElement);
    });

    return tabPane;
}

function createAssignmentElement(assignment) {
    const div = document.createElement('div');
    div.className = 'assignment-item';
    
    div.innerHTML = `
        <h4 class="item-title">${assignment.title}</h4>
        <p class="item-description">${assignment.description}</p>
        <div class="item-meta">
            <span class="text-primary">Due: ${formatDate(assignment.dueDate)}</span>
            <span class="ms-3">Points: ${assignment.points}</span>
        </div>
        ${assignment.resources ? createResourceLinks(assignment.resources) : ''}
    `;
    
    return div;
}

function createActivityElement(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    
    div.innerHTML = `
        <h4 class="item-title">${activity.title}</h4>
        <p class="item-description">${activity.description}</p>
        <div class="item-meta">
            <span class="text-success">Date: ${formatDate(activity.date)}</span>
            <span class="ms-3">Duration: ${activity.duration}</span>
        </div>
        ${activity.sampleUrl ? `
            <a href="${activity.sampleUrl}" class="resource-link" target="_blank" rel="noopener noreferrer">
                🔗 View Sample
            </a>
        ` : ''}
    `;
    
    return div;
}

function createResourceLinks(resources) {
    return resources.map(resource => `
        <a href="${resource.url}" class="resource-link" target="_blank" rel="noopener noreferrer">
            📚 ${resource.title}
        </a>
    `).join('');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}