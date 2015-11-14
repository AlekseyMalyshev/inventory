
'use strict';

$(document).ready(init);

function init() {
  $('i.new-room').on('click', newRoom);
  $('div.house').on('click', 'table.room i.new-item', newItem);
  $('div.house').on('click', 'table.room i.edit-room', editRoom);
  $('div.house').on('click', 'table.items i.edit-item', editItem);
  $('div.house').on('click', 'table.room i.delete-room', confirmDeleteRoom);
  $('div.house').on('click', 'table.items i.delete-item', confirmDeleteItem);
  $('div.house').on('click', 'table.items i.unlist-item', unlistItem);
  $('div.house').on('click', 'table.items i.move-item', moveItem);
  $('div.house').on('click', 'table.room i.fa-tags', toggleItems);

  $('div.house').on('submit', 'form.new-item', saveNewItem);
  $('div.house').on('reset', 'form.new-item', showTable);

  $('div.house').on('submit', 'form.new-room', saveNewRoom);
  $('div.house').on('reset', 'form.new-room', showTable);
}

function newRoom(event) {
  event.stopPropagation();

  $.ajax({
    method: 'GET',
    url: '/room',
    success: showForm,
    error: showError
  });
}

function newItem(event) {
  event.stopPropagation();

  $.ajax({
    method: 'GET',
    url: '/item',
    success: showForm,
    error: showError
  });
}

function editRoom(event) {
  event.stopPropagation();
  var id = $(event.target).parents('div.room').attr('id');

  $.ajax({
    method: 'GET',
    url: '/room/' + id.substring(3),
    success: showForm,
    error: showError
  });
}

function editItem(event) {
  event.stopPropagation();
  var id = $(event.target).parents('tr').attr('id');

  $.ajax({
    method: 'GET',
    url: '/item/' + id.substring(3),
    success: showForm,
    error: showError
  });
}

function confirmDeleteRoom(event) {
  event.stopPropagation();

  $('h4.modal-title').text('Are you sure you want to delete the room and all it\'s items?');
  $('button.cancel').off();
  //$('button.cancel').on('click', cancelEdit);
  $('button.confirm').off();
  $('button.confirm').attr('id', $(event.target).parents('div.room').attr('id'));
  $('button.confirm').on('click', deleteRoom);
  $('div#confirm').modal();
}

function deleteRoom(event) {
  var id = $(event.target).attr('id');

  $.ajax({
    method: 'DELETE',
    url: '/api/rooms/' + id.substring(3),
    success: domDeleteRoom,
    error: showError
  });
}

function confirmDeleteItem(event) {
  event.stopPropagation();

  $('h4.modal-title').text('Are you sure you want to delete the item?');
  $('button.cancel').off();
  //$('button.cancel').on('click', cancelEdit);
  $('button.confirm').off();
  $('button.confirm').attr('id', $(event.target).parents('tr').attr('id'));
  $('button.confirm').on('click', deleteItem);
  $('div#confirm').modal();
}

function deleteItem(event) {
  var id = $(event.target).attr('id');

  $.ajax({
    method: 'DELETE',
    url: '/api/items/' + id.substring(3),
    success: domDeleteItem,
    error: showError
  });
}

function unlistItem(event) {
  event.stopPropagation();
  var $item = $(event.target).parents('tr');
  var id = $(event.target).parents('tr').attr('id');
  var roomId = $(event.target).parents('div.room').attr('id');

  $.ajax({
    method: 'POST',
    url: '/api/rooms/unlist/' + roomId.substring(3) + '/' + id.substring(3),
    success: showTable,
    error: showError
  });
}

function moveItem(event) {
  event.stopPropagation();
  var $item = $(event.target).parents('tr');
  var id = $item.attr('id');
  var roomId = $item.find('select.to-room').val();
  if (roomId) {
    $.ajax({
      method: 'POST',
      url: '/api/rooms/move/' + roomId.substring(3) + '/' + id.substring(3),
      success: showTable,
      error: showError
    });
  }
}

function toggleItems(event) {
  event.stopPropagation();

  var $room = $(event.target).parents('div.room');
  var $items = $room.find('table.items');
  if ($items.find('tr').length > 0) {
    $room.find('table.items').slideToggle('fast');
  }
}

function domDeleteItem(item) {
  var loc = 'table.items tr#id_' + item._id;
  $(loc).remove();
}

function domDeleteRoom(room) {
  var loc = 'div.room#id_' + room._id;
  $(loc).remove();
}

function saveNewItem(event) {
  var item = {};
  $(event.target).find('input').each(function() {
    var key = $(this).attr('id');
    var value = $(this).val();
    item[key] = value;
  });

  var id = $(event.target).attr('id').substring(3);
  if (id) {
    item._id = id;
  }

  $.ajax({
    method: id ? 'PUT' : 'POST',
    url: '/api/items',
    data: item,
    success: showTable,
    error: showError
  });

  return false;
}

function saveNewRoom(event) {
  var room = {};
  $(event.target).find('input').each(function() {
    var key = $(this).attr('id');
    var value = $(this).val();
    room[key] = value;
  });

  var id = $(event.target).attr('id').substring(3);
  if (id) {
    room._id = id;
  }

  $.ajax({
    method: id ? 'PUT' : 'POST',
    url: '/api/rooms',
    data: room,
    success: showTable,
    error: showError
  });

  return false;
}

function showTable() {
  $('div.house').children().remove();

  $.ajax({
    method: 'GET',
    url: '/rooms',
    success: function (html) {
      $('div.house').prepend($.parseHTML(html));
    },
    error: showError
  });

  $.ajax({
    method: 'GET',
    url: '/unlisted',
    success: function (html) {
      $('div.house').append($.parseHTML(html));
    },
    error: showError
  });
}

function showForm(html) {
  $('div.house').children().remove();
  $('div.house').append($.parseHTML(html));
}

function showError(err) {
  console.log(err);
  $('h4.error').text(err.responseText);
  $('div#show-error').modal();
}
