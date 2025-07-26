export default function Profile() {
  return (
    <div className="p-6 bg-white h-full">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="space-y-2">
        <div><strong>Name:</strong> John Doe</div>
        <div><strong>Email:</strong> john@example.com</div>
        <div><strong>Status:</strong> 👋 Available</div>
        {/* Add more user data if needed */}
      </div>
    </div>
  );
}