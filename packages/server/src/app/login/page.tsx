export default function LoginPage() {
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
        <h1 className="pt-1 text-center text-3xl font-bold">Log In</h1>
        <p className="mb-6 text-center text-gray-500">
          Don't have an account?{' '}
          <a
            className="underline hover:text-black dark:hover:text-gray-200"
            href="/join"
          >
            Sign Up
          </a>
        </p>
        <div className="mb-8 grid grid-cols-1 gap-3">
          <label>
            Username or Email Address
            <input
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              className="input"
              name="username"
              placeholder="Username or Email Address"
              type="text"
              required
            />
          </label>
          <label className="">
            Password
            <input
              autoComplete="current-password"
              className="input"
              name="password"
              placeholder="Password"
              type="password"
              required
            />
          </label>
        </div>
        <div>
          <button className="btn btn-lg w-full" type="submit">
            Login
          </button>
          <p className="mb-1 mt-4 text-center text-sm text-gray-800">
            <a
              className="underline hover:text-black dark:hover:text-gray-200"
              href="/reset-password"
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </form>
    </section>
  );
}
