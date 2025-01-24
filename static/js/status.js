document.addEventListener("DOMContentLoaded", () => {
    const updateStatus = () => {
        fetch('https://api.swqh.online/sleep_status/get')
            .then(response => response.json())
            .then(data => {
                const statusElement = document.getElementById('status');
                const additionalInfoElement = document.getElementById('additional-info');
                const sleepDateElement = document.getElementById('sleep-date');
                statusElement.textContent = "正在更新";
                statusElement.classList.remove('sleeping', 'awake', 'error', 'maimai');
                const statusData = data.data.status_code;
                statusElement.textContent = data.data.status.trim();
                
                if (statusData === 0) {
                    statusElement.classList.add('sleeping');
                    additionalInfoElement.textContent = '如果情况紧急，请直接以电话等方式和Hoshino-Yukino取得联系。';
                } else if (statusData === 1) {
                    statusElement.classList.add('awake');
                    additionalInfoElement.textContent = '这意味着你可以直接通过任何方式和Hoshino-Yukino取得联系。';
                } else if (statusData === 2) {
                    statusElement.classList.add('maimai');
                    additionalInfoElement.textContent = '可能无法及时回复，如果情况紧急，请直接以电话等方式和Hoshino-Yukino取得联系。';
                } else if (statusData === 3) {
                    statusElement.classList.add('drive');
                    additionalInfoElement.textContent = '可能无法及时回复，如果情况紧急，请直接以电话等方式和Hoshino-Yukino取得联系。';
				} else {
                    statusElement.textContent = '<!>后端响应出错<!>';
                    statusElement.classList.add('error');
                    additionalInfoElement.textContent = '错误会很快恢复。如果情况紧急，请直接以电话等方式和Hoshino-Yukino取得联系。';
                }

                const updateDate = new Date(data.data.update_date);
                const relativeTime = getRelativeTime(updateDate);
                sleepDateElement.textContent = relativeTime;
                sleepDateElement.setAttribute('data-tooltip', data.data.update_date); // 设置自定义属性以显示注释
            })
            .catch(error => {
                console.error('Error:', error);
                const statusElement = document.getElementById('status');
                const additionalInfoElement = document.getElementById('additional-info');
                statusElement.textContent = '<!>请求失败<!>';
                statusElement.classList.add('error');
                additionalInfoElement.textContent = '错误会很快恢复。如果情况紧急，请直接以电话等方式和Hoshino-Yukino取得联系。';
            });
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const diff = now - date;
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            return `${diffDays}天前`;
        } else if (diffHours > 0) {
            return `${diffHours}小时前`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes}分钟前`;
        } else {
            return `刚刚`;
        }
    };

    const updateBackground = () => {
        fetch('https://api.swqh.online/sleep_status/get_background_url')
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('404 Not Found');
                    }
                    throw new Error('Failed to fetch background URL');
                }
                return response.text();
            })
            .then(url => {
                const trimmedUrl = url.trim();
                const img = new Image();
                img.onload = () => {
                    document.body.style.backgroundImage = `url('${trimmedUrl}')`;
                };
                img.onerror = () => {
                    console.error('Image not found or failed to load:', trimmedUrl);
					location.reload();
                };
                img.src = trimmedUrl;
            })
            .catch(error => {
                console.error('Error fetching background URL:', error);
            });
    };

    updateStatus();
    updateBackground();

    setInterval(() => {
        updateStatus();
    }, 30000);
    setInterval(() => {
        updateBackground();
    }, 60000);
});
