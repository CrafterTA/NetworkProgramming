
// Clear localStorage and cookies
localStorage.clear();
console.log('LocalStorage cleared');

// Clear cookies
document.cookie.split(';').forEach(function(c) { 
  document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); 
});
console.log('Cookies cleared');

// Reload page
window.location.reload();

