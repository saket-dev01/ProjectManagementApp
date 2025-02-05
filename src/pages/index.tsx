export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start pt-8 min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        Welcome to Project Management App
      </h1>
      <p className="text-lg text-center mb-4">
        Manage your projects, tasks, and teams in one place. Stay organized and track progress seamlessly.
      </p>
      <p className="text-md text-center text-gray-700 mb-8">
        Whether you are working on a solo project or collaborating with a team, our platform helps you streamline your workflow and enhance productivity.
      </p>
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-blue-500">Getting Started</h2>
        <p className="text-lg text-gray-600 mt-2">
          Sign up or log in to create your first project and start managing your tasks today!
        </p>
      </div>
    </div>
  );
}
