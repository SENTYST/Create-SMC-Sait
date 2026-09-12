// Create SMC — копирование IP и мобильное меню
(function () {
  var SERVER_IP = 'smc.wellduck.org';

  function copyText(text, onOk, onFail) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onOk, function () {
        fallbackCopy(text, onOk, onFail);
      });
    } else {
      fallbackCopy(text, onOk, onFail);
    }
  }

  function fallbackCopy(text, onOk, onFail) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) { onOk(); } else if (onFail) { onFail(); }
    } catch (e) {
      if (onFail) { onFail(); }
    }
  }

  function bindCopyButton(btn) {
    if (!btn) { return; }
    var hint = document.getElementById('copyHint');
    var originalLabel = btn.querySelector('.btn__label');
    var originalText = originalLabel ? originalLabel.textContent : null;

    btn.addEventListener('click', function () {
      var ip = btn.getAttribute('data-ip') || SERVER_IP;
      copyText(ip, function () {
        if (originalLabel) {
          originalLabel.textContent = 'IP скопирован!';
          setTimeout(function () { originalLabel.textContent = originalText; }, 2000);
        }
        if (hint) {
          hint.textContent = 'Готово! IP ' + ip + ' скопирован — вставьте его в игре.';
          hint.classList.add('success');
        }
        if (btn.id === 'copyIpBtn2') {
          var old = btn.innerHTML;
          btn.innerHTML = 'Скопировано ✓';
          setTimeout(function () {
            btn.innerHTML = old;
            bindCopyButton(document.getElementById('copyIpBtn2'));
          }, 2000);
        }
      }, function () {
        if (hint) { hint.textContent = 'Не удалось скопировать. IP: ' + ip; }
        else { alert('IP сервера: ' + ip); }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindCopyButton(document.getElementById('copyIpBtn'));
    bindCopyButton(document.getElementById('copyIpBtn2'));

    // Мобильное меню
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      });
      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });
})();
