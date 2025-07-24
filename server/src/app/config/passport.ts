/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { IsActive, ROLE } from "../Modules/user/user.interface";
import { User } from "../Modules/user/user.model";
import { envVars } from "./env";

// ========================= setup custom login authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: any) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done(null, false, { message: "User doesn't exist" });
        }

        if (!isUserExist.isVerified) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   "Youre not verifed. Please verify first!"
          // );
          return done(null, false, {
            message: "Youre not verifed. Please verify first!",
          });
        }

        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          // throw new AppError(
          //   httpStatus.NOT_FOUND,
          //   `User has been ${isUserExist.isActive}. contact with our team`
          // );
          return done(null, false, {
            message: `User has been ${isUserExist.isActive}. contact with our team`,
          });
        }

        if (isUserExist.isDeleted) {
          // throw new AppError(httpStatus.NOT_FOUND, "User deleted");
          return done(null, false, { message: "User is deleted" });
        }

        const isGoogleAuthenticatior = isUserExist.auths.some(
          (providerObject) => providerObject.provider === "google"
        );

        if (isGoogleAuthenticatior && !isUserExist.password) {
          return done(
            "Your account was created using Google. To log in, please click the 'Continue with Google' button. If you'd like to log in with a password, please set one first by using the 'Set Password?' option in your account."
          );
        }

        const isPasswordMatch = await bcrypt.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, isUserExist, {
          message: "User Logged In successfully!",
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

// ========================= setup google authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile?.emails?.[0]?.value;


        if (!email) {
          return done(null, false, { message: "email not found" });
        }

        let isUserExist = await User.findOne({ email });

        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, {
            message: "Youre not verifed. Please verify first!",
          });
        }

        if (
          isUserExist &&
          (isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.INACTIVE)
        ) {
          return done(null, false, {
            message: `User has been ${isUserExist.isActive}. contact with our team`,
          });
        }

        if (isUserExist && isUserExist.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        if (!isUserExist) {
          isUserExist = await User.create({
            name: profile.displayName,
            email,
            picture: profile?.photos?.[0]?.value,
            role: ROLE.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile?.emails?.[0]?.value,
              },
            ],
          });
        }

        return done(null, isUserExist);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
