function showProgress(event) {
    // Prevent default for demo purposes
    event.preventDefault();

    // Show progress bar and file info
    const progressBar = document.querySelector('.progress-bar');
    const fileInfo = document.querySelector('.file-info');
    progressBar.style.display = 'block';
    fileInfo.style.display = 'block';

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            // Actual file download
            window.location.href = event.target.closest('a').href;
        }
    }, 100);
}

// Optional: Add file size and type detection
async function getFileInfo(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const size = response.headers.get('content-length');
        const type = response.headers.get('content-type');
        
        const fileInfo = document.querySelector('.file-info');
        fileInfo.textContent = `Size: ${formatBytes(size)} | Type: ${type}`;
    } catch (error) {
        console.error('Error fetching file info:', error);
    }
}

// Helper function to format bytes
function formatBytes(bytes) {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}