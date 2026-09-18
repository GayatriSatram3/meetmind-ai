import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  ArrowLeft,
  Loader2,
  Crown,
  Shield,
  User,
} from "lucide-react";

import api from "../api/axios";
import "../styles/MembersPage.css";


function MembersPage() {

const navigate = useNavigate();
const [members, setMembers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [showAddMember, setShowAddMember] = useState(false);
const [email, setEmail] = useState("");
const [addingMember, setAddingMember] = useState(false);
const [addMemberError, setAddMemberError] = useState("");
const [addMemberSuccess, setAddMemberSuccess] = useState("");

const [updatingRole, setUpdatingRole] = useState("");
const [roleError, setRoleError] = useState("");

const [removingMember, setRemovingMember] = useState("");
const [removeError, setRemoveError] = useState("");


  useEffect(() => {

    const fetchMembers = async () => {

      try {

        setLoading(true);

        const workspaceId =
          localStorage.getItem("workspaceId");


        if (!workspaceId) {

          setError(
            "Workspace not found. Please log in again."
          );

          return;
        }


        const response =
          await api.get(
            `/members/${workspaceId}`
          );


        setMembers(
          response.data.members || []
        );


      } catch (error) {

        console.error(
          "Members error:",
          error.response?.data || error
        );


        setError(
          error.response?.data?.message ||
          "Failed to load workspace members."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchMembers();

  }, []);


  const getRoleIcon = (role) => {

    if (role === "OWNER") {
      return <Crown size={15} />;
    }

    if (role === "ADMIN") {
      return <Shield size={15} />;
    }

    return <User size={15} />;
  };


  const getInitials = (name) => {

    if (!name) return "?";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  };

const handleAddMember = async (e) => {

  e.preventDefault();

  setAddMemberError("");
  setAddMemberSuccess("");

  if (!email.trim()) {
    setAddMemberError(
      "Please enter an email address."
    );
    return;
  }

  try {

    setAddingMember(true);

    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setAddMemberError(
        "Workspace not found."
      );
      return;
    }

    const response = await api.post(
      `/members/${workspaceId}`,
      {
        email: email.trim(),
      }
    );

    // Add the newly created member
    // directly to the current list

    setMembers((prev) => [
      ...prev,
      response.data.member,
    ]);

    setEmail("");

    setAddMemberSuccess(
  "Member added successfully."
);

setTimeout(() => {
  setShowAddMember(false);
}, 700);

  } catch (error) {

    console.error(
      "Add member error:",
      error.response?.data || error
    );

    setAddMemberError(
      error.response?.data?.message ||
      "Failed to add member."
    );

  } finally {

    setAddingMember(false);

  }
};

const handleRoleChange = async (
  memberId,
  role
) => {

  try {

    setUpdatingRole(memberId);
    setRoleError("");

    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setRoleError(
        "Workspace not found."
      );
      return;
    }


    const response = await api.patch(
      `/members/${workspaceId}/role`,
      {
        memberId,
        role,
      }
    );


    // Update the member locally

    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? response.data.member
          : member
      )
    );


  } catch (error) {

    console.error(
      "Role update error:",
      error.response?.data || error
    );

    setRoleError(
      error.response?.data?.message ||
      "Failed to update member role."
    );

  } finally {

    setUpdatingRole("");

  }
};


const handleRemoveMember = async (memberId) => {
    const confirmed = window.confirm(
        "Are you sure you want to remove this member?"
    );

    if (!confirmed) {
        return;
    }

    try {
        setRemovingMember(memberId);
        setRemoveError("");

        const workspaceId =
            localStorage.getItem("workspaceId");

        if (!workspaceId) {
            setRemoveError("Workspace not found.");
            return;
        }

        await api.delete(
            `/members/${workspaceId}/${memberId}`
        );

        setMembers((prev) =>
            prev.filter(
                (member) => member.id !== memberId
            )
        );

    } catch (error) {
        console.error(
            "Remove member error:",
            error.response?.data || error
        );

        setRemoveError(
            error.response?.data?.message ||
            "Failed to remove member."
        );

    } finally {
        setRemovingMember("");
    }
};

  if (loading) {

    return (
      <div className="members-loading">

        <Loader2
          size={28}
          className="spin"
        />

        <p>
          Loading workspace members...
        </p>

      </div>
    );

  }


  if (error) {

    return (
      <div className="members-error">

        <h2>
          Something went wrong
        </h2>

        <p>
          {error}
        </p>

      </div>
    );

  }


  return (

    <div className="members-page">

      {/* Header */}

      <div className="members-header">

        <div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </button>


          <div className="members-eyebrow">

            <Users size={16} />

            WORKSPACE MEMBERS

          </div>


          <h1>
            Team Members
          </h1>


          <p>
            Manage the people who have access
            to this workspace.
          </p>

        </div>


        <div className="members-header-actions">

  <div className="member-count">

    <strong>
      {members.length}
    </strong>

    <span>
      {members.length === 1
        ? "member"
        : "members"}
    </span>

  </div>


  <button
    className="add-member-button"
    onClick={() => {
      setShowAddMember(true);
      setAddMemberError("");
      setAddMemberSuccess("");
    }}
  >
    + Add Member
  </button>

</div>

      </div>


      {/* Members List */}

      <div className="members-list">

        {members.length === 0 ? (

          <div className="empty-members">

            <Users size={32} />

            <h3>
              No members yet
            </h3>

            <p>
              There are no members in this
              workspace.
            </p>

          </div>

        ) : (

          members.map((member) => (

            <div
              className="member-card"
              key={member.id}
            >

              {/* Avatar */}

              <div className="member-avatar">

                {getInitials(
                  member.user.name
                )}

              </div>


              {/* Information */}

              <div className="member-info">

                <h3>
                  {member.user.name}
                </h3>

                <p>
                  {member.user.email}
                </p>

              </div>


              {/* Role */}

              <div className="member-actions">

    <div className="member-role-section">
        {member.role === "OWNER" ? (
            <div className="member-role owner">
                {getRoleIcon(member.role)}
                <span>OWNER</span>
            </div>
        ) : (
            <div className="role-control">
                {updatingRole === member.id ? (
                    <div className="role-updating">
                        <Loader2
                            size={14}
                            className="spin"
                        />
                        Updating...
                    </div>
                ) : (
                    <select
                        className={`role-select ${member.role.toLowerCase()}`}
                        value={member.role}
                        onChange={(e) =>
                            handleRoleChange(
                                member.id,
                                e.target.value
                            )
                        }
                    >
                        <option value="MEMBER">
                            MEMBER
                        </option>

                        <option value="ADMIN">
                            ADMIN
                        </option>
                    </select>
                )}
            </div>
        )}
    </div>

    {member.role !== "OWNER" && (
        <button
            className="remove-member-button"
            onClick={() =>
                handleRemoveMember(member.id)
            }
            disabled={
                removingMember === member.id
            }
        >
            {removingMember === member.id ? (
                <>
                    <Loader2
                        size={14}
                        className="spin"
                    />
                    Removing...
                </>
            ) : (
                "Remove"
            )}
        </button>
    )}

</div>

            </div>

          ))

        )}

      </div>


      {roleError && (
  <div className="role-error">
    {roleError}
  </div>
)}

{removeError && (
    <div className="remove-error">
        {removeError}
    </div>
)}


      {showAddMember && (

  <div
    className="modal-overlay"
    onClick={() =>
      setShowAddMember(false)
    }
  >

    <div
      className="add-member-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <div className="modal-header">

        <div>
          <h2>
            Add workspace member
          </h2>

          <p>
            Add an existing MeetMind AI user
            to this workspace.
          </p>
        </div>

        <button
          className="modal-close"
          onClick={() =>
            setShowAddMember(false)
          }
        >
          ×
        </button>

      </div>


      <form
        onSubmit={handleAddMember}
      >

        <label>
          Email address
        </label>

        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          autoFocus
        />


        {addMemberError && (
          <p className="form-error">
            {addMemberError}
          </p>
        )}


        {addMemberSuccess && (
          <p className="form-success">
            {addMemberSuccess}
          </p>
        )}


        <div className="modal-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              setShowAddMember(false)
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="confirm-add-button"
            disabled={addingMember}
          >

            {addingMember ? (
              <>
                <Loader2
                  size={15}
                  className="spin"
                />
                Adding...
              </>
            ) : (
              "Add Member"
            )}

          </button>

        </div>

      </form>

    </div>

  </div>

)}

    </div>

  );

}


export default MembersPage;