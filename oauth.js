'use strict';
(() => {
  const status = document.getElementById('status');
  const redirect = new URL('callback.html', location.href).href.split(/[?#]/)[0];
  const connect = document.getElementById('connect');
  try {
    if (connect) {
      const params = new URLSearchParams(location.hash.slice(1));
      history.replaceState(null, '', location.pathname);
      const clientKey = params.get('client_key');
      const state = params.get('state');
      if (!clientKey || !/^[A-Za-z0-9_-]{32,128}$/.test(state || '')) {
        status.textContent = 'Chưa có phiên hợp lệ. Chạy scripts/tiktok_oauth.py start trong project riêng để bắt đầu.';
        return;
      }
      sessionStorage.setItem('tuoi20.oauth', JSON.stringify({state, created: Date.now()}));
      status.textContent = 'Phiên đã sẵn sàng. Bạn sẽ được chuyển đến TikTok để chọn tài khoản và xem các quyền.';
      document.getElementById('consent').addEventListener('change', event => {connect.disabled = !event.target.checked;});
      connect.addEventListener('click', () => {
        const auth = new URL('https://www.tiktok.com/v2/auth/authorize/');
        auth.search = new URLSearchParams({client_key: clientKey, response_type: 'code', scope: 'user.info.basic,video.upload', redirect_uri: redirect, state}).toString();
        location.assign(auth.href);
      });
    } else {
      const params = new URLSearchParams(location.search);
      history.replaceState(null, '', location.pathname);
      const pending = JSON.parse(sessionStorage.getItem('tuoi20.oauth') || 'null');
      sessionStorage.removeItem('tuoi20.oauth');
      if (!pending || params.get('state') !== pending.state || Date.now() - pending.created > 600000) throw new Error('Phiên không khớp hoặc đã hết hạn. Hãy bắt đầu lại từ công cụ trên máy.');
      if (params.has('error')) throw new Error('TikTok chưa cấp quyền hoặc bạn đã hủy. Hãy kiểm tra trạng thái app và thử lại.');
      const code = params.get('code');
      if (!code) throw new Error('Phản hồi thiếu mã ủy quyền.');
      document.getElementById('heading').textContent = 'Đã nhận mã từ TikTok';
      status.textContent = 'Tải file rồi chạy lệnh finish trên máy để đổi mã lấy token. Kết nối chỉ hoàn tất khi bước đó thành công.';
      const button = document.getElementById('download');
      button.hidden = false;
      button.addEventListener('click', () => {
        const url = URL.createObjectURL(new Blob([JSON.stringify({code, state: pending.state})], {type:'application/json'}));
        const a = document.createElement('a'); a.href = url; a.download = 'tuoi20-oauth-response.json'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }
  } catch (error) { status.textContent = error.message || 'Không thể dùng lưu trữ phiên. Hãy cho phép sessionStorage và bắt đầu lại.'; }
})();
