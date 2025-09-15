// GitHub Storage System для автоматического сохранения
class GitHubStorage {
    constructor() {
        this.config = {
            owner: 'sleepwalker105',
            repo: 'Nowhere',
            branch: 'main',
            // ВАЖНО: Храните токен в переменной окружения или используйте GitHub Actions
            // Для демо - вставьте ваш токен здесь (но это небезопасно для продакшена)
            token: 'ВАШ_GITHUB_TOKEN_ЗДЕСЬ' 
        };
        this.baseUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents`;
    }

    // Сохранить изображение на GitHub
    async uploadImage(file, filename) {
        try {
            const base64Content = await this.fileToBase64(file);
            const path = `images/projects/${filename}`;
            
            const response = await fetch(`${this.baseUrl}/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Add project image: ${filename}`,
                    content: base64Content.split(',')[1], // убираем data:image prefix
                    branch: this.config.branch
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Возвращаем прямую ссылку на изображение
                return `https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}/images/projects/${filename}`;
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Image upload failed:', error);
            return null;
        }
    }

    // Сохранить проекты в JSON файл
    async saveProjects(projects) {
        try {
            const content = JSON.stringify(projects, null, 2);
            const base64Content = btoa(unescape(encodeURIComponent(content)));
            
            // Сначала получаем SHA существующего файла (если есть)
            let sha = null;
            try {
                const existingFile = await fetch(`${this.baseUrl}/data/projects.json`, {
                    headers: {
                        'Authorization': `Bearer ${this.config.token}`
                    }
                });
                if (existingFile.ok) {
                    const existingData = await existingFile.json();
                    sha = existingData.sha;
                }
            } catch (e) {
                // Файл не существует, это нормально
            }

            const body = {
                message: `Update projects data - ${new Date().toISOString()}`,
                content: base64Content,
                branch: this.config.branch
            };

            if (sha) {
                body.sha = sha; // Нужно для обновления существующего файла
            }

            const response = await fetch(`${this.baseUrl}/data/projects.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            return response.ok;
        } catch (error) {
            console.error('Projects save failed:', error);
            return false;
        }
    }

    // Загрузить проекты из GitHub
    async loadProjects() {
        try {
            const response = await fetch(`https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}/data/projects.json`);
            
            if (response.ok) {
                const projects = await response.json();
                return projects;
            } else {
                console.log('No projects file found, starting with empty array');
                return [];
            }
        } catch (error) {
            console.error('Projects load failed:', error);
            return [];
        }
    }

    // Вспомогательная функция для конвертации файла в base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Генерация уникального имени файла
    generateFilename(originalName) {
        const timestamp = Date.now();
        const extension = originalName.split('.').pop().toLowerCase();
        const randomId = Math.random().toString(36).substr(2, 9);
        return `project-${timestamp}-${randomId}.${extension}`;
    }
}

// Создаем глобальный экземпляр
window.githubStorage = new GitHubStorage();

console.log('GitHub Storage initialized! 🐙');