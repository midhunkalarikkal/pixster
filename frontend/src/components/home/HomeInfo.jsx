const HomeInfo = () => {
  return (
    <div className="flex flex-col w-full md:w-7/12 bg-base-100 p-6 rounded-2xl shadow-lg">
      <div className="h-[24rem] md:h-[32rem] rounded-xl flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            🔒 Your Privacy Matters
          </h2>
          <p className="text-base leading-relaxed">
            For your privacy and safety, all accounts are currently set to private.
            You can get started by searching for your friends, sending them a friend request,
            and once connected, you can enjoy seamless communication together.
          </p>
          <p className="mt-6 text-sm italic">
            Let’s build your private circle, securely.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeInfo