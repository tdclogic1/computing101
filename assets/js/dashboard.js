// Function to load and preview JSON data
async function loadJsonPreviews() {
    try {
        const jsonFiles = ['course-data.json', 'users.json', 'policy.json'];
        
        for (const file of jsonFiles) {
            const response = await fetch(`/assets/json/${file}`);
            const data = await response.json();
            const preview = JSON.stringify(data, null, 2).slice(0, 200) + '...';
            document.getElementById(`${file.split('.')[0]}DataPreview`).textContent = preview;
        }
    } catch (error) {
        console.error('Error loading JSON previews:', error);
    }
}

// Function to view full JSON content
function viewJson(filename) {
    window.open(`/assets/json/${filename}`, '_blank');
}

// Function to edit JSON content
function editJson(filename) {
    // Implementation for JSON editing interface
    console.log(`Edit ${filename}`);
    // Could open a modal with JSON editor or redirect to editor page
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadJsonPreviews();
    
    // Handle sidebar navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Add scroll spy behavior
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });
});

// Function to update page status
function updatePageStatus(pagePath, status) {
    // Implementation for updating page status (active/inactive)
    console.log(`Update ${pagePath} status to ${status}`);
}

// Function to generate sitemap
function generateSitemap() {
    // Implementation for sitemap generation
    console.log('Generating sitemap...');
}

// Function to check broken links
async function checkBrokenLinks() {
    // Implementation for broken link checker
    console.log('Checking for broken links...');
}

// Function to backup data
async function backupData() {
    // Implementation for data backup
    console.log('Backing up data...');
}