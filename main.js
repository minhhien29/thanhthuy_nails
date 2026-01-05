/**
 * THANHTHUY NAILS - MESSENGER INTEGRATION
 * Facebook ID: tranphanthanhthuy.1312
 */

// 1. Dữ liệu lịch Tết khớp hoàn toàn với ảnh mẫu
const tetDates = [
    { d: "07-02-2026", l: "20 Tết" }, { d: "08-02-2026", l: "21 Tết" },
    { d: "09-02-2026", l: "22 Tết" }, { d: "10-02-2026", l: "23 Tết" },
    { d: "11-02-2026", l: "24 Tết" }, { d: "12-02-2026", l: "25 Tết" },
    { d: "13-02-2026", l: "26 Tết" }, { d: "14-02-2026", l: "27 Tết" },
    { d: "15-02-2026", l: "28 Tết" },
    { d: "16-02-2026", l: "29 Tết", busy: ["16h", "18h", "20h", "22h"] } 
];

// 9 khung giờ chuẩn từ ảnh mẫu
const timeSlots = ["06h", "08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"]; 
let currentBooking = {};

// 2. Hàm Render Lịch lưới rực rỡ
function renderCalendar() {
    const body = document.getElementById('calendarBody');
    if (!body) return;
    body.innerHTML = ''; 

    tetDates.forEach(dateObj => {
        const row = document.createElement('div');
        row.className = 'calendar-row';
        let slotsHtml = '';
        timeSlots.forEach(time => {
            const isBusy = dateObj.busy && dateObj.busy.includes(time);
            slotsHtml += `
                <button type="button" class="slot-btn ${isBusy ? 'busy' : ''}" 
                        ${isBusy ? 'disabled' : ''} 
                        onclick="handleOpenModal('${dateObj.d}', '${dateObj.l}', '${time}')">
                    ${isBusy ? 'X' : time}
                </button>`;
        });
        row.innerHTML = `<div class="row-date"><strong>${dateObj.d}</strong><br><small>(${dateObj.l})</small></div><div class="row-slots">${slotsHtml}</div>`;
        body.appendChild(row);
    });
}

// 3. Xử lý Modal
window.handleOpenModal = function(date, lunar, time) {
    currentBooking = { date, lunar, time };
    const infoDisplay = document.getElementById('infoDisplay');
    if (infoDisplay) infoDisplay.innerText = `📅 ${time} - Ngày ${date} (${lunar})`;
    document.getElementById('bookingModal').classList.remove('hidden');
};

window.closeModal = function() {
    document.getElementById('bookingModal').classList.add('hidden');
};

// 4. Hàm gửi thông tin qua Facebook Messenger
function handleBookingSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const service = document.getElementById('custService').value;
    
    // Username Facebook lấy từ link bạn cung cấp
    const fbUsername = "tranphanthanhthuy.1312"; 
    
    // Nội dung tin nhắn đặt lịch
    const message = `[THANHTHUY NAILS - ĐẶT LỊCH TẾT]\n- Khách hàng: ${name.toUpperCase()}\n- SĐT: ${phone}\n- Dịch vụ: ${service}\n- Giờ: ${currentBooking.time}\n- Ngày: ${currentBooking.date} (${currentBooking.lunar})`;

    // 1. Copy vào bộ nhớ đệm (Clipboard) để khách dễ dàng dán vào chat
    navigator.clipboard.writeText(message).then(() => {
        alert("Đã sao chép nội dung đặt lịch! Nàng chỉ cần dán (Paste) vào tin nhắn và gửi cho Shop nhé.");
        
        // 2. Mở link chat Messenger
        const fbUrl = `https://m.me/${fbUsername}`;
        window.open(fbUrl, '_blank');
    }).catch(err => {
        console.error('Lỗi copy:', err);
        window.open(`https://m.me/${fbUsername}`, '_blank');
    });

    closeModal();
}

// 5. Khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    const form = document.getElementById('nailForm');
    if (form) form.addEventListener('submit', handleBookingSubmit);
});
