import { ButtonLink, UserSmall } from '@/components';
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import React, { useState } from 'react';

const IntroPage: React.FC = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (username === '') return;
    Router.push(`/gh/${username}`);
  };

  return (
    <div className="min-h-full grid gap-4 items-center text-center py-8">
      <Head>
        <title>Select projects</title>
        <meta name="description" content="Select projects" />
      </Head>
      {session ? (
        <AuthenticatedUser user={session.user} />
      ) : (
        <ButtonLink onClick={() => signIn()} text="Sign in with Github" />
      )}
      <div className="my-8">or</div>
      <SearchForm
        username={username}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default IntroPage;

const AuthenticatedUser: React.FC<{
  user: { login: string; image: string };
}> = ({ user }) => {
  return (
    <div className="grid place-content-center gap-4">
      <Link href={`/gh/${user?.login}`}>
        <div className="flex gap-2 flex-col sm:flex-row items-center mx-auto cursor-pointer">
          <div className="underline text-accent dark:text-accent-dark cursor-pointer">
            View your projects
          </div>
          <UserSmall
            owner={{
              avatar_url: user?.image,
              login: user?.login,
            }}
          />
        </div>
      </Link>
      <ButtonLink onClick={() => signOut()}>Sign out</ButtonLink>
    </div>
  );
};

const SearchForm: React.FC<{
  username: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ username, handleChange, handleSubmit }) => {
  return (
    <form className="flex mx-auto justify-center flex-col sm:flex-row gap-4 items-stretch max-w-sm sm:max-w-none">
      <div
        className={
          username !== ''
            ? "w-fit relative before:content-['@'] before:left-2.5 before:top-2 before:absolute before:text-stone-500"
            : 'w-fit'
        }
      >
        <input
          className=" transition-colors rounded-[5px] px-5 py-2 border dark:bg-stone-900 border-stone-500 dark:border-[#666] min-w-[250px]"
          type="text"
          name="username"
          id="username"
          placeholder="Github @username..."
          value={username}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className=" transition-colors text-stone-900 dark:text-stone-200 bg-white dark:bg-stone-900 rounded-[5px] px-5 py-2 
        border border-stone-500 dark:border-stone-500"
      >
        🔎 Find user
      </button>
    </form>
  );
};
