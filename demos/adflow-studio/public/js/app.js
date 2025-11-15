// AdFlow Studio - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adForm');
    const resultsSection = document.getElementById('results');
    const loadingSection = document.getElementById('loading');
    const adResults = document.getElementById('adResults');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        showLoading();

        try {
            const formData = new FormData(form);

            const response = await fetch('/create-ad', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create ad');
            }

            displayResults(result);

        } catch (error) {
            console.error('Error:', error);
            showError(error.message);
        }
    });

    function showLoading() {
        form.style.display = 'none';
        resultsSection.style.display = 'none';
        loadingSection.style.display = 'block';
    }

    function showResults() {
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'block';
    }

    function showError(message) {
        loadingSection.style.display = 'none';
        form.style.display = 'block';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;

        const container = document.querySelector('.upload-section');
        container.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function displayResults(data) {
        adResults.innerHTML = '';

        if (data.processedImage) {
            const imageCard = createImageCard(data);
            adResults.appendChild(imageCard);
        }

        data.adVariants.forEach(variant => {
            const videoCard = createVideoCard(variant);
            adResults.appendChild(videoCard);
        });

        showResults();
    }

    function createImageCard(data) {
        const card = document.createElement('div');
        card.className = 'ad-card';

        card.innerHTML = `
            <h3><i class="fas fa-image"></i> Enhanced Product Image</h3>
            <div class="ad-preview">
                <img src="data:image/jpeg;base64,${data.processedImage}" alt="${data.productName}" style="width: 100%; border-radius: 8px;">
            </div>
            <div class="ad-stats">
                <span><i class="fas fa-tag"></i> ${data.productName}</span>
                <span><i class="fas fa-clock"></i> Enhanced</span>
            </div>
            <button class="download-btn" onclick="downloadImage('${data.processedImage}', '${data.productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_enhanced.jpg')">
                <i class="fas fa-download"></i> Download Image
            </button>
        `;

        return card;
    }

    function createVideoCard(variant) {
        const card = document.createElement('div');
        card.className = 'ad-card';

        const platformIcons = {
            tiktok: 'fab fa-tiktok',
            instagram: 'fab fa-instagram',
            youtube: 'fab fa-youtube'
        };

        const platformNames = {
            tiktok: 'TikTok',
            instagram: 'Instagram',
            youtube: 'YouTube Shorts'
        };

        card.innerHTML = `
            <h3>
                <i class="${platformIcons[variant.platform]} platform-icon platform-${variant.platform}"></i>
                ${platformNames[variant.platform]} Ad
            </h3>
            <div class="ad-preview">
                <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center;">
                    <i class="fas fa-video" style="font-size: 2rem; color: #666;"></i>
                    <p style="margin-top: 10px; color: #666;">Video: ${variant.duration}s, ${variant.aspectRatio}</p>
                    <p style="font-size: 0.9rem; color: #888; margin-top: 5px;">
                        AI-generated with voiceover
                    </p>
                </div>
            </div>
            <div class="ad-stats">
                <span><i class="fas fa-clock"></i> ${variant.duration}s</span>
                <span><i class="fas fa-expand"></i> ${variant.aspectRatio}</span>
            </div>
            <button class="download-btn" onclick="alert('Video download would be implemented with actual video generation')">
                <i class="fas fa-download"></i> Download Video
            </button>
        `;

        return card;
    }
});

// Global functions for download buttons
function downloadImage(base64Data, filename) {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Image preview functionality
document.getElementById('productImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Could show preview here if desired
            console.log('Image selected:', file.name);
        };
        reader.readAsDataURL(file);
    }
});
