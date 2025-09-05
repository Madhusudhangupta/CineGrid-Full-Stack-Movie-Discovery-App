
export default function UserProfile({ user }) {
  return (
    <div className="border p-4 rounded my-4">
      <h2 className="text-xl font-bold">Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}