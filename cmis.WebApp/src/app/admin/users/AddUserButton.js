"use client";

import React, { useState } from "react";
import AddUserModal from "./AddUserModal";
import { signup } from "@/app/login/actions";


function AddUserButton({getUsers}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="border rounded px-2 bg-blue-600 text-white mb-2"
      >
        Add User
      </button>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getUsers={getUsers}
      />
    </>
  );
}

export default AddUserButton;
