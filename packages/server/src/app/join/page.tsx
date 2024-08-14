export default function JoinPage() {
  return (
    <section className="pt-24 border-gray-100 col-span-full flex-1 pb-16 md:pb-0 px-6">
      <form className="mx-auto rounded-2xl border bg-white p-4 shadow md:w-96 md:px-5">
        <img
          alt="Logo here"
          className="mx-auto -mt-12 mb-2 w-20 h-20 bg-purple-500"
          src={
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAA' +
            'AC0Ujn1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAA' +
            'DsMAAA7DAcdvqGQAAAEDSURBVEhLtZJBEoMwDAP7lr6nn+0LqUGChsVOwoG' +
            'dvTSSNRz6Wh7jxvT7+wn9Y4LZae0e+rXLeBqjh45rBtOYgy4V9KYxlOpqRj' +
            'mNiY4+uJBP41gOI5BM40w620AknTVwGgfSWQMK0tnOaRpV6ewCatLZxn8aJ' +
            'emsAGXp7JhGLBX1wYlUtE4jkIpnwKGM9xeepG7mwblMpl2/CUbCJ7+6CnQz' +
            'Aw5lvD/8DxGIpbMClKWzdjpASTq7gJp0tnGaDlCVzhpQkM52OB3gQDrbQCS' +
            'dNSTTAc7kMAL5dIDjjj64UE4HmEh1NaM3HWAIulQwmA4wd+i4ZjwdYDR00G' +
            'qWsyPrizLD76QCPOHqP2cAAAAAElFTkSuQmCC'
          }
        />
        <h1 className="pt-1 text-center text-3xl font-bold">Join Shadr!</h1>
        <p className="mb-6 text-center text-gray-500">
          Join a community of graphics enthusiasts!
        </p>
        <div className="mb-8 grid grid-cols-1 gap-3">
          <label>
            Email Address
            <input
              autoComplete="email"
              className="input"
              name="email"
              placeholder="Email Address"
              type="email"
              required
            />
          </label>
          <label className="">
            Password
            <input
              autoComplete="new-password"
              className="input"
              maxLength={100}
              minLength={4}
              name="password"
              placeholder="Password"
              type="password"
              required
            />
          </label>
        </div>
        <div>
          <button className="btn lg w-full" type="submit">
            Next
          </button>
          <p className="mb-1 mt-4 text-center text-sm text-gray-800">
            Already have an account?{' '}
            <a
              className="underline hover:text-black dark:hover:text-gray-200"
              href="/login"
            >
              Log in
            </a>
          </p>
        </div>
      </form>
    </section>
  );
}
