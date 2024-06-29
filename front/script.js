$(document).ready(function () {
  let selectedUserId;

  function fetchUsers() {
    axios
      .get("http://localhost:3000/users")
      .then(response => {
        const users = response.data;
        const tbody = $("#usersTable tbody");
        tbody.empty();
        users.forEach(user => {
          const row = `
                                <tr data-id="${user._id}">
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.age}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary edit-user">Edit</button>
                                        <button class="btn btn-sm btn-warning update-password">Update Password</button>
                                        <button class="btn btn-sm btn-danger delete-user">Delete</button>
                                    </td>
                                </tr>
                            `;
          tbody.append(row);
        });
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });
  }

  fetchUsers();

  $("#usersTable").on("click", ".edit-user", function () {
    const row = $(this).closest("tr");
    selectedUserId = row.data("id");
    const userName = row.find("td").eq(0).text();
    const userEmail = row.find("td").eq(1).text();
    const userAge = row.find("td").eq(2).text();
    $("#editUserName").val(userName);
    $("#editUserEmail").val(userEmail);
    $("#editUserAge").val(userAge);
    $("#editUserModal").modal("show");
  });

  $("#editUserForm").submit(function (event) {
    event.preventDefault();
    const updatedUser = {
      name: $("#editUserName").val(),
      email: $("#editUserEmail").val(),
      age: $("#editUserAge").val(),
    };

    axios
      .patch(`http://localhost:3000/users/${selectedUserId}`, updatedUser)
      .then(response => {
        $("#editUserModal").modal("hide");
        fetchUsers();
      })
      .catch(error => {
        console.error("There was an error updating the user!", error);
      });
  });

  $("#usersTable").on("click", ".update-password", function () {
    const row = $(this).closest("tr");
    selectedUserId = row.data("id");
    $("#updatePasswordModal").modal("show");
  });

  $("#updatePasswordForm").submit(function (event) {
    event.preventDefault();
    const passwordData = {
      old_password: $("#oldPassword").val(),
      new_password: $("#newPassword").val(),
      confirm_password: $("#confirmPassword").val(),
    };

    axios
      .patch(
        `http://localhost:3000/users/update/${selectedUserId}`,
        passwordData
      )
      .then(response => {
        $("#updatePasswordModal").modal("hide");
      })
      .catch(error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const errorMessage = error.response.data.message;
          $("#updatePasswordError").text(errorMessage);
        } else {
          console.error("There was an error updating the password!", error);
        }
      });
  });

  $("#usersTable").on("click", ".delete-user", function () {
    const userId = $(this).closest("tr").data("id");

    axios
      .delete(`http://localhost:3000/users/${userId}`)
      .then(response => {
        fetchUsers();
      })
      .catch(error => {
        console.error("There was an error deleting the user!", error);
      });
  });

  $("#newUserForm").submit(function (event) {
    event.preventDefault();
    const newUser = {
      name: $("#newUserName").val(),
      email: $("#newUserEmail").val(),
      age: $("#newUserAge").val(),
      password: $("#newUserPassword").val(),
      confirm_password: $("#newUserConfirmPassword").val(),
    };

    axios
      .post("http://localhost:3000/users", newUser)
      .then(response => {
        $("#newUserModal").modal("hide");
        fetchUsers();
      })
      .catch(error => {
        console.error("There was an error creating the user!", error);
      });
  });
});
