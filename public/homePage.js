"use strics";

// Выход из личного кабинета
let logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success === true) {
            location.reload();
        } else {
            console.error(response.error);
        }
    });
};

// Получение информации о пользователе
let current = ApiConnector.current((response) => {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data);
    } else {
        console.error('Ошибка профиля: ' + response.error);
    }
});

// Получение текущих курсов валюты
let ratesBoard = new RatesBoard();

function getCurrency() {
    ApiConnector.getStocks((response) => {
        if (response.success === true) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        } else {
            console.error('Ошибка получения курсов валют');
        }
    });
}

getCurrency();

setInterval(getCurrency(), 60000);

// Операции с деньгами
let moneyManager = new MoneyManager();

// Пополнение баланса
moneyManager.addMoneyCallback = ((data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Баланс успешно пополнен");
        } else {
            moneyManager.setMessage(false, "Ошибка пополнения баланса");
        }
    });
});

// Конвертирование валюты
moneyManager.conversionMoneyCallback = ((data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация завершена успешно");
        } else {
            moneyManager.setMessage(false, "Ошибка конвертации");
        }
    });
});

// Перевод валюты
moneyManager.sendMoneyCallback = ((data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.moneyManager(true, "Перевод завершен успешно");
        } else {
            moneyManager.moneyManager(false, "Ошибка перевода");
        }
    });
});

// Работа с избранным
let favoritesWidget = new FavoritesWidget();

// Запросить начальный список избранного
ApiConnector.getFavorites = ((response) => {
    if (response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

// Добавление в список избранного
favoritesWidget.addUserCallback = ((data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен");
        } else {
            favoritesWidget.setMessage(false, "Ошибка добавления в избранное: " + response.error);
        }
    });
});

// Удаление из избранного
favoritesWidget.removeUserCallback = ((data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален");
        } else {
            favoritesWidget.setMessage(false, "Ошибка удаления из избранного: " + response.error);
        }
    });
});