var rp = require('request-promise');


class Qiwi {
    constructor(token) {
        this.recipients = {
            qiwi: 99,
            visa_rus: 1963,
            mastercard_rus: 21013,
            visa_sng: 1960,
            mastercard_sng: 21012,
            mir: 31652,
            tinkoff: 466,
            alfa: 464,
            promsvyaz: 821,
            russkiy_standard: 815
        }
        this.token = token;
        this.headers = {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        }
        this.apiUri = "https://edge.qiwi.com/";
    }

    async getAccountInfo() {
        try {
            var options = {
                url: this.apiUri + 'person-profile/v1/profile/current',
                headers: this.headers,
                json: true
            };
            return await rp.get(options);
        } catch (error) {
            throw error;
        }
    }
    async getBalance() {
        try {
            var options = {
                url: this.apiUri + 'funding-sources/v1/accounts/current',
                headers: this.headers,
                json: true
            };
            return await rp.get(options);
        } catch (error) {
            throw error;
        }

    }

    async getOperationHistory(requestOptions) {
        try {
            var accountInfo = await this.getAccountInfo();
            var options = {
                url: this.apiUri + 'payment-history/v1/persons/' + accountInfo.authInfo.personId + '/payments',
                headers: this.headers,
                qs: {
                    rows: requestOptions.rows,
                    operation: requestOptions.operation,
                    sources: requestOptions.sources,
                    startDate: requestOptions.startDate,
                    endDate: requestOptions.endDate,
                    nextTxnDate: requestOptions.nextTxnDate,
                    nextTxnId: requestOptions.nextTxnId
                },
                json: true
            };
            return await rp.get(options);
        } catch (error) {
            throw error;
        }
    }


    async getOperationStats(requestOptions) {
        try {
            var accountInfo = await this.getAccountInfo();
            var options = {
                url: this.apiUri + 'payment-history/v1/persons/' + accountInfo.authInfo.personId + '/payments/total',
                headers: this.headers,
                qs: {
                    operation: requestOptions.operation,
                    sources: requestOptions.sources,
                    startDate: requestOptions.startDate,
                    endDate: requestOptions.endDate
                },
                json: true
            };
            return await rp.get(options);
        } catch (error) {
            throw error;
        }
        var accountInfo = await this.getAccountInfo();
    }

    async toWallet(requestOptions) {
        try {
            var options = {
                url: this.apiUri + 'sinap/terms/99/payments',
                headers: this.headers,
                body: {
                    id: (1000 * Date.now()).toString(),
                    sum: {
                        amount: requestOptions.amount,
                        currency: "643"
                    },
                    source: "account_643",
                    paymentMethod: {
                        type: "Account",
                        accountId: "643"
                    },
                    comment: requestOptions.comment,
                    fields: {
                        account: requestOptions.account
                    }
                },
                json: true
            };
            return await rp.post(options);
        } catch (error) {
            throw error;
        }
    }

    async toMobilePhone(requestOptions) {
        try {
            var operator = await this.detectOperator('7' + requestOptions.account);
            if (operator.code.value == 2)
                throw new Error('Can\'t detect operator.');
            var options = {
                url: this.apiUri + 'sinap/terms/' + operator.message + '/payments',
                headers: this.headers,
                body: {
                    id: (1000 * Date.now()).toString(),
                    sum: {
                        amount: requestOptions.amount,
                        currency: "643"
                    },
                    source: "account_643",
                    paymentMethod: {
                        type: "Account",
                        accountId: "643"
                    },
                    comment: requestOptions.comment,
                    fields: {
                        account: requestOptions.account
                    }
                },
                json: true
            };
            return await rp.post(options);
        } catch (error) {
            throw error;
        }
    }

    async toCard(requestOptions) {
        try {
            var card = await this.detectCard(requestOptions.account);
            if (card.code.value == "2")
                throw new Error('Wrong card number!');
            var options = {
                url: this.apiUri + 'sinap/terms/' + card.message + '/payments',
                headers: this.headers,
                body: {
                    id: (1000 * Date.now()).toString(),
                    sum: {
                        amount: requestOptions.amount,
                        currency: "643"
                    },
                    source: "account_643",
                    paymentMethod: {
                        type: "Account",
                        accountId: "643"
                    },
                    comment: requestOptions.comment,
                    fields: {
                        account: requestOptions.account
                    }
                },
                json: true
            };
            return await rp.post(options);
        } catch (error) {
            throw error;
        }
    }

    async toBank(requestOptions, recipient) {
        try {
            var options = {
                url: this.apiUri + 'sinap/terms/' + recipient + '/payments',
                headers: this.headers,
                body: {
                    id: (1000 * Date.now()).toString(),
                    sum: {
                        amount: requestOptions.amount,
                        currency: "643"
                    },
                    source: "account_643",
                    paymentMethod: {
                        type: "Account",
                        accountId: "643"
                    },
                    comment: requestOptions.comment,
                    fields: {
                        account: requestOptions.account,
                        account_type: requestOptions.account_type,
                        exp_date: requestOptions.exp_date
                    }
                },
                json: true
            };
            return await rp.post(options);
        } catch (error) {
            throw error;
        }
    }

    async checkComission(recipient) {
        try {
            var options = {
                url: this.apiUri + 'sinap/providers/' + recipient + '/form',
                json: true
            }
            return await rp.get(options);
        } catch (error) {
            throw error;
        }
    }

    async detectOperator(phone) {
        try {
            var options = {
                url: 'https://qiwi.com/mobile/detect.action',
                headers: this.headers,
                qs: {
                    phone: phone
                },
                json: true
            };
            return await rp.post(options);
        } catch (error) {
            throw error;
        }
    }

    async detectCard(cardNumber) {
        try {
            var options = {
                url: 'https://qiwi.com/card/detect.action',
                headers: this.headers,
                qs: {
                    cardNumber: cardNumber
                },
                json: true
            };
            return await rp.post(options);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = {
    Qiwi: Qiwi
}
