// =========================================================================
// НАСТРОЙКИ ДОСТУПА И АВТОРСКИХ ПРАВ (ЕДИНЫЙ ФАЙЛ ДЛЯ ВСЕХ 8 СТРАНИЦ КУРСА)
// =========================================================================

// 1. Впишите сюда цифровые Telegram ID учеников, оплативших курс (через запятую).
// Первый номер — ваш личный Telegram ID (узнать его можно в боте @userinfobot).
const ALLOWED_USERS = [
    859435297, // Мой ID
    806762570, // Аиша
    
];

// 2. Укажите ваш контакт для связи (чтобы ученики знали, кому писать для покупки)
const AUTHOR_CONTACT = "@Abu_Aisha";

// 3. Строка об авторских правах внизу каждой страницы
const COPYRIGHT_TEXT = "© Интерактивный курс по Сире Пророка ﷺ, 2026. Все права защищены. Копирование и передача доступа третьим лицам запрещены.";

// =========================================================================
// СИСТЕМНЫЙ КОД ПРОВЕРКИ ДОСТУПА (НИЖЕ НИЧЕГО МЕНЯТЬ НЕ НУЖНО)
// =========================================================================

(function () {
    function extractTelegramUser() {
        try {
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
                return window.Telegram.WebApp.initDataUnsafe.user;
            }
            const raw = (window.location.hash ? window.location.hash.substring(1) : "") ||
                        (window.location.search ? window.location.search.substring(1) : "");
            if (raw) {
                const params = new URLSearchParams(raw);
                const tgWebAppData = params.get("tgWebAppData");
                if (tgWebAppData) {
                    const inner = new URLSearchParams(tgWebAppData);
                    const userStr = inner.get("user");
                    if (userStr) {
                        return JSON.parse(userStr);
                    }
                }
            }
        } catch (e) {}
        return null;
    }

    function getVerifiedUser() {
        const tgUser = extractTelegramUser();
        if (tgUser && tgUser.id) {
            sessionStorage.setItem("sira_tg_user", JSON.stringify(tgUser));
            return tgUser;
        }
        try {
            const saved = sessionStorage.getItem("sira_tg_user");
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return null;
    }

    function renderLockScreen(user) {
        const userIdText = user && user.id
            ? `<div style="margin: 16px 0; padding: 12px; background: #d8dad6; border: 1px solid #9ea19c; border-radius: 10px; font-size: 1rem;">
                 Ваш Telegram ID: <strong id="tg-uid-val" style="color: #1d4f22; user-select: all;">${user.id}</strong>
                 <div style="font-size: 0.85rem; color: #454946; margin-top: 4px;">Отправьте этот номер автору после оплаты для открытия доступа</div>
               </div>`
            : `<div style="margin: 16px 0; padding: 12px; background: #d8dad6; border: 1px solid #9ea19c; border-radius: 10px; font-size: 0.92rem; color: #454946;">
                 Курс открывается только внутри официального бота в Telegram.
               </div>`;

        document.body.innerHTML = `
            <div style="max-width: 560px; margin: 40px auto; background: #ccceca; border: 1px solid #9ea19c; border-radius: 14px; padding: 28px 22px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.12); color: #191c1a;">
                <div style="font-size: 2.4rem; margin-bottom: 10px;">🔒</div>
                <h2 style="margin: 0 0 10px 0; color: #1d4f22; font-size: 1.35rem;">Доступ к курсу закрыт</h2>
                <p style="margin: 0 0 12px 0; font-size: 0.98rem; line-height: 1.5;">
                    Этот интерактивный тренажёр по Сире Пророка ﷺ предназначен только для зарегистрированных учеников.
                </p>
                ${userIdText}
                <p style="margin: 14px 0 0 0; font-size: 0.95rem;">
                    Для получения доступа напишите автору: <strong>${AUTHOR_CONTACT}</strong>
                </p>
                <div style="margin-top: 22px; padding-top: 14px; border-top: 1px solid #9ea19c; font-size: 0.78rem; color: #454946;">
                    ${COPYRIGHT_TEXT}
                </div>
            </div>
        `;
    }

    function appendFooter(user) {
        const container = document.querySelector(".container") || document.body;
        const footer = document.createElement("footer");
        footer.style.cssText = "margin-top: 24px; padding: 14px 10px; text-align: center; font-size: 0.8rem; color: #454946; border-top: 1px solid #9ea19c;";
        const badge = user && user.id ? ` | Лицензия: ID ${user.id}` : " | Локальный режим автора";
        footer.innerHTML = `${COPYRIGHT_TEXT}${badge}`;
        container.appendChild(footer);
    }

    document.addEventListener("DOMContentLoaded", function () {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }

        // Локальное открытие файла на компьютере автора разрешено для проверки
        const isLocalFile = window.location.protocol === "file:";
        const user = getVerifiedUser();
        const isAllowed = isLocalFile || (user && ALLOWED_USERS.includes(Number(user.id)));

        if (!isAllowed) {
            renderLockScreen(user);
        } else {
            appendFooter(user);
        }
    });
})();
