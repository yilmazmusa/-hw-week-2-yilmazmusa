
const userForm = document.querySelector('.member-form');


const userList = document.querySelector('.member-list');


const sender = document.querySelector('#sender');
const recipient = document.querySelector('#recipient');
const transactionForm = document.querySelector('.transaction-form');


const historyDetailsList = document.querySelector('.history-list');


const filterSender = document.querySelector('#filter-sender');
const filterRecipient = document.querySelector('#filter-recipient');
const filterSenderRecipient = document.querySelector('#filter-sender-recipient');

// Clear Filter Button
const clearFilter = document.querySelector('.clear-filter');

const subscribersOnCustomerAdd = [
  userList,
  historyDetailsList,
  sender,
  recipient,
  filterSender,
  filterRecipient,
  filterSenderRecipient,
];

// State of the App
const state = {
  userList: [],
  historyDetailsList: [],
};



function renderSenderList(list, subscriber) {
  list.forEach((customer) => {
    let newSenderItem = document.createElement('option');
    newSenderItem.text = customer.name;
    newSenderItem.setAttribute('data-id', customer.id);
    newSenderItem.setAttribute('data-customerBalanceId', customer.balance);
    subscriber.appendChild(newSenderItem);
  });
}

function renderuserList(list, subscriber) {
  list.forEach((customer) => {
    const newCustomerLi = document.createElement('li');
    const html = `${customer.name} &#8658 ${customer.balance}TL`;
    const button = document.createElement('button');
    button.innerText = 'Sil';
    button.setAttribute('class', 'customer-delete-button');
    button.addEventListener('click', removeCustomer);
    newCustomerLi.innerHTML = html;
    newCustomerLi.appendChild(button);
    newCustomerLi.setAttribute('class', 'customers-list-item');
    newCustomerLi.setAttribute('data-id', customer.id);
    subscriber.appendChild(newCustomerLi);
  });
}




function renderFilteredList(list, subscriber) {
  list.forEach((customer) => {
    let filteredItem = document.createElement('option');
    filteredItem.text = customer.name;
    filteredItem.setAttribute('data-id', customer.id);
    subscriber.appendChild(filteredItem);
  });
}

function renderRecipientList(list, subscriber) {
  list.forEach((customer) => {
    let newRecipientItem = document.createElement('option');
    newRecipientItem.text = customer.name;
    newRecipientItem.setAttribute('data-id', customer.id);
    newRecipientItem.setAttribute('data-customerBalanceId', customer.balance);
    subscriber.appendChild(newRecipientItem);
  });
}



function renderListsOnCustomerAddAndMakeTransaction() {
  subscribersOnCustomerAdd.forEach(function (subscriber) {
    subscriber.innerHTML = '';
    if (subscriber.getAttribute('class') === 'member-list') {
      renderuserList(state.userList, subscriber);
    } else if (subscriber.getAttribute('id') === 'sender') {
      renderSenderList(state.userList, subscriber);
    } else if (subscriber.getAttribute('id') === 'recipient') {
      renderRecipientList(state.userList, subscriber);
    } else if (subscriber.getAttribute('class') === 'history-list') {
      renderHistoryDetailsList(state.historyDetailsList, subscriber);
    } else if (subscriber.getAttribute('id') === 'filter-sender') {
      renderFilteredList(state.userList, subscriber);
    } else if (subscriber.getAttribute('id') === 'filter-recipient') {
      renderFilteredList(state.userList, subscriber);
    } else if (subscriber.getAttribute('id') === 'filter-sender-recipient') {
      renderFilteredList(state.userList, subscriber);
    }
  });
}

// setState Function
function setState(operation, newValue, customer1, customer2, transactionAmount) {
  if (operation === 'addCustomer') {
    //this block will work when a new customer added
    state.userList = newValue;
    // state.historyDetailsList will be updated here
    state.historyDetailsList = [
      ...state.historyDetailsList,
      {
        id: Math.floor(Math.random() * 1000000000) + 1,
        operation: 'addCustomer',
        customer: { ...newValue[newValue.length - 1] },
      },
    ];
    renderListsOnCustomerAddAndMakeTransaction();
  } else if (operation === 'makeTransaction') {
    //this block will work when a transaction made
    state.userList = newValue;
    // state.historyDetailsList will be updated here
    state.historyDetailsList = [
      ...state.historyDetailsList,
      {
        id: Math.floor(Math.random() * 1000000000) + 1,
        operation: 'makeTransaction',
        sender: { ...customer1 },
        recipient: { ...customer2 },
        transactionAmount,
        isRemoved: false,
      },
    ];
    renderListsOnCustomerAddAndMakeTransaction();
  } else if (operation === 'removeCustomer') {
    state.userList = newValue;
    renderListsOnCustomerAddAndMakeTransaction();
  } else if (operation === 'removeTransaction') {
    state.userList = newValue;
    // state.historyDetailsList will be updated here
    state.historyDetailsList = [
      ...state.historyDetailsList,
      {
        id: Math.floor(Math.random() * 1000000000) + 1,
        operation: 'removeTransaction',
        sender: { ...customer1 },
        recipient: { ...customer2 },
        transactionAmount,
      },
    ];
    renderListsOnCustomerAddAndMakeTransaction();
  }
}

// Submit Event of Customer Form
userForm.addEventListener('submit', (e) => {
  const customerName = document.querySelector('#member-name').value;
  const customerBalance = document.querySelector('#member-balance').value;

  e.preventDefault();

  setState('addCustomer', [
    ...state.userList,
    {
      name: customerName,
      id: Math.floor(Math.random() * 1000000000) + 1,
      balance: customerBalance,
    },
  ]);
  console.log(state.historyDetailsList);
  userForm.reset();
});

// Submit Event of Transaction Form
transactionForm.addEventListener('submit', (e) => {
  const sender = document.querySelector('#sender');
  const recipient = document.querySelector('#recipient');
  const transactionAmount = document.querySelector('#amount').value;

  e.preventDefault();

  let senderId = sender.options[sender.selectedIndex].getAttribute('data-id');
  let recipientId = recipient.options[recipient.selectedIndex].getAttribute('data-id');

  if (senderId !== recipientId) {
    let senderBalance = sender.options[sender.selectedIndex].getAttribute('data-customerBalanceId');
    let recipientBalance = recipient.options[recipient.selectedIndex].getAttribute('data-customerBalanceId');

    let senderNewBalance = Number(senderBalance) - Number(transactionAmount);
    let recipientNewBalance = Number(recipientBalance) + Number(transactionAmount);

    const updateduserList = state.userList.map((customer) => {
      if (Number(senderId) === Number(customer.id)) {
        return { ...customer, balance: senderNewBalance };
      } else if (Number(recipientId) === Number(customer.id)) {
        return { ...customer, balance: recipientNewBalance };
      } else {
        return { ...customer };
      }
    });

    const senderToBeUpdated = updatedCustomer(updateduserList, senderId);

    const recipientToBeUpdated = updatedCustomer(updateduserList, recipientId);

    setState('makeTransaction', [...updateduserList], senderToBeUpdated, recipientToBeUpdated, transactionAmount);
    console.log(updateduserList);
  } else {
    alert('Gönderici ile Alıcı aynı kişi olamaz');
    transactionForm.reset();
  }

  transactionForm.reset();
});

// onClick event of 'customer-delete-button' button on Customer List
function removeCustomer(e) {
  const customerId = e.target.parentElement.getAttribute('data-id');
  const updateduserList = state.userList.filter((customer) => {
    if (customer.id !== Number(customerId)) {
      return true;
    }
  });
  setState('removeCustomer', [...updateduserList]);
}

// onClick event of 'transaction-delete-button' button on History Details List
function removeTransaction(e) {
  const historyDetailId = Number(e.target.parentElement.getAttribute('data-id'));
  const historyDetailIndex = state.historyDetailsList.findIndex((hisDet) => {
    if (hisDet.id === historyDetailId) {
      return true;
    }
  });
  const historyDetail = state.historyDetailsList[historyDetailIndex];

  historyDetail.isRemoved = true; // açıkla işlemi

  const senderId = historyDetail.sender.id;
  const recipientId = historyDetail.recipient.id;
  const transactionAmount = historyDetail.transactionAmount;

  let senderBalance,
    recipientBalance = 0;

  state.userList.forEach((customer) => {
    if (Number(customer.id) === Number(senderId)) {
      senderBalance = customer.balance;
    } else if (Number(customer.id) === Number(recipientId)) {
      recipientBalance = customer.balance;
    }
  });

  if (
    state.userList.some((customer) => (customer.id === senderId ? true : false)) &&
    state.userList.some((customer) => (customer.id === recipientId ? true : false))
  ) {
    // Transaction will be removed here
    const senderNewBalance = Number(senderBalance) + Number(transactionAmount); // customer listten alacaksın
    const recipientNewBalance = Number(recipientBalance) - Number(transactionAmount); // customer listten alacaksın

    const updateduserList = state.userList.map((customer) => {
      if (Number(senderId) === Number(customer.id)) {
        return { ...customer, balance: senderNewBalance };
      } else if (Number(recipientId) === Number(customer.id)) {
        return { ...customer, balance: recipientNewBalance };
      } else {
        return { ...customer };
      }
    });

    const newSender = updatedCustomer(updateduserList, recipientId);

    const newRecipient = updatedCustomer(updateduserList, senderId);

    setState('removeTransaction', [...updateduserList], newSender, newRecipient, transactionAmount);
  } else {
    alert('Bu işlemdeki müşterilerden biri ya da ikisi silinmiş');
  }
}

filterSender.addEventListener('change', () => {
  let senderId = filterSender.options[filterSender.selectedIndex].getAttribute('data-id');
  let copyHistoryDetails = [...state.historyDetailsList];
  let filteredSenderArray = [];
  copyHistoryDetails.forEach((historyDetail) => {
    console.log('history: ', historyDetail);
    if (Number(historyDetail.sender?.id) === Number(senderId)) {
      filteredSenderArray.push(historyDetail);
    }
  });
  renderHistoryDetailsList(filteredSenderArray, historyDetailsList);
});

filterRecipient.addEventListener('change', () => {
  let recipientId = filterRecipient.options[filterRecipient.selectedIndex].getAttribute('data-id');
  let copyHistoryDetails = [...state.historyDetailsList];
  let filteredRecipientArray = [];
  copyHistoryDetails.forEach((historyDetail) => {
    console.log('history: ', historyDetail);
    if (Number(historyDetail.recipient?.id) === Number(recipientId)) {
      filteredRecipientArray.push(historyDetail);
    }
  });
  renderHistoryDetailsList(filteredRecipientArray, historyDetailsList);
});

filterSenderRecipient.addEventListener('change', () => {
  let senderRecipientId = filterSenderRecipient.options[filterSenderRecipient.selectedIndex].getAttribute('data-id');
  let copyHistoryDetails = [...state.historyDetailsList];
  let filteredCustomersArray = [];
  copyHistoryDetails.forEach((historyDetail) => {
    if (Number(historyDetail.sender?.id) === Number(senderRecipientId)) {
      filteredCustomersArray.push(historyDetail);
    } else if (Number(historyDetail.recipient?.id) === Number(senderRecipientId)) {
      filteredCustomersArray.push(historyDetail);
    }
  });
  renderHistoryDetailsList(filteredCustomersArray, historyDetailsList);
});

// Bring All the History Details
clearFilter.addEventListener('click', () => {
  renderHistoryDetailsList(state.historyDetailsList, historyDetailsList);
});

// Element generators according to the operation type for History Details List
function renderHistoryDetailsList(list, subscriber) {
  subscriber.innerHTML = '';
  list.forEach((historyDetail) => {
    if (historyDetail.operation === 'addCustomer') {
      const newHistoryDetailLi = document.createElement('li');
      const html = `${historyDetail.customer.name} kişisi ${historyDetail.customer.balance}TL ile hesap oluşturdu.`;
      newHistoryDetailLi.innerHTML = html;
      newHistoryDetailLi.setAttribute('class', 'history-detail-list-item');
      newHistoryDetailLi.setAttribute('data-id', historyDetail.id);
      subscriber.appendChild(newHistoryDetailLi);
    } else if (historyDetail.operation === 'makeTransaction') {
      const newHistoryDetailLi = document.createElement('li');
      const html = `${historyDetail['sender']['name']} kişisi, ${historyDetail.recipient.name} kişisine ${historyDetail.transactionAmount}TL gönderdi.`;
      newHistoryDetailLi.innerHTML = html;
      // buton rengini ayarla
      if (!historyDetail.isRemoved) {
        // açıkla
        const button = document.createElement('button');
        button.setAttribute('id', 'remove-button');
        button.innerText = 'Geri Al';
        button.setAttribute('class', 'transaction-delete-button');
        button.addEventListener('click', removeTransaction);
        button.style.color = 'black';
        if (
          !state.userList.some((customer) => {
            customer.id === historyDetail.sender.id ? true : false;
          }) &&
          !state.userList.some((customer) => {
            customer.id === historyDetail.recipient.id ? true : false;
          })
        ) {
          button.style.color = 'red';
        }
        newHistoryDetailLi.appendChild(button);
      }
      newHistoryDetailLi.setAttribute('class', 'history-detail-list-item');
      newHistoryDetailLi.setAttribute('data-id', historyDetail.id);
      subscriber.appendChild(newHistoryDetailLi);
    } else if (historyDetail.operation === 'removeTransaction') {
      const newHistoryDetailLi = document.createElement('li');
      const html = `${historyDetail.sender.name} kişisi, ${historyDetail.recipient.name} kişisinden aldığı ${historyDetail.transactionAmount}TL'yi ${historyDetail.recipient.name} kişisine geri gönderdi.`;
      newHistoryDetailLi.innerHTML = html;
      newHistoryDetailLi.setAttribute('class', 'history-detail-list-item');
      newHistoryDetailLi.setAttribute('data-id', historyDetail.id);
      subscriber.appendChild(newHistoryDetailLi);
    }
  });
}

// Use this function to update the customer object on transactions(to get the new customer from updated customer list)
function updatedCustomer(list, customerId) {
  const newCustomerIndex = list.findIndex((customer) => {
    if (Number(customer.id) === Number(customerId)) {
      return true;
    }
  });
  const newCustomer = list[newCustomerIndex];
  return newCustomer;
}