'use strict';

const logoutBtn = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

logoutBtn.action = () => {
    ApiConnector.logout(response => {
        if(response.success) {
            window.location.reload();
        }
    });
}

ApiConnector.current(response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const getRates = () => {
    ApiConnector.getStocks(response => {
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

getRates();
setInterval(getRates, 60000);

const moneyManagerApiConnectorCb = response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(true, 'Операция выполнена');
    } else {
        moneyManager.setMessage(false, response.error);
    }
}

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, moneyManagerApiConnectorCb);
}

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, moneyManagerApiConnectorCb);
}

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, moneyManagerApiConnectorCb);
}

ApiConnector.getFavorites(response => {
    if(response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

const favoritesWidgetApiConnectorCb = response => {
    if(response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(true, 'Операция выполнена');
    } else {
        favoritesWidget.setMessage(false, response.error);
    }
}

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, favoritesWidgetApiConnectorCb);
}

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, favoritesWidgetApiConnectorCb);
}