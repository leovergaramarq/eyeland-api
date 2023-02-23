import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTSrategy, ExtractJwt } from 'passport-jwt';
import { AdminModel, StudentModel, TeacherModel } from '../models';

// passport setting up
passport.use('signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        // const user = await User.create({username, password});
        const user: any = { _id: 'dfsfsfsdfw2r34rq', username, password };
        return done(null, user);
    } catch (err) {
        done(err);
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const student = await StudentModel.findOne({
            attributes: ['id_student', 'username', 'password'],
            where: { username }
        });
        if (!student) {
            // TODO: check if it's teacher or admin
            return done(null, false, { message: 'Student not found (passport)' });
        }
        if (!student.comparePassword(password)) {
            return done(null, false, { message: 'Wrong Password' });
        }
        done(null, {id: student.id_student});
    } catch (err) {
        return done(err);
    }
}));

passport.use('jwt-admin', new JWTSrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || ' top secret '
}, async (jwt_payload: { id: number }, done: Function) => {
    try {
        // check if the token has expired

        // const expirationDate = new Date(jwt_payload.exp * 1000);
        // if (expirationDate < new Date()) {
        //     return done(null, false);
        // }

        const user = await AdminModel.findByPk(jwt_payload.id);
        if (!user) return done(null, false);

        done(null, jwt_payload.id ? jwt_payload : false);
    } catch (error) {
        // logger.error(error);
        done(error);
    }
}));

passport.use('jwt-professor', new JWTSrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || ' top secret '
}, async (jwt_payload: { id: number }, done: Function) => {
    try {
        // check if the token has expired

        // const expirationDate = new Date(jwt_payload.exp * 1000);
        // if (expirationDate < new Date()) {
        //     return done(null, false);
        // }
        
        passport.authenticate('jwt-admin', { session: false }, (err, user, _info) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            done(null, jwt_payload.id ? jwt_payload : false);
        });


        const user = await TeacherModel.findByPk(jwt_payload.id);
        if (!user) return done(null, false);

        done(null, jwt_payload.id ? jwt_payload : false);
    } catch (error) {
        // logger.error(error);
        done(error);
    }
}));

passport.use('jwt-student', new JWTSrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || ' top secret '
}, async (jwt_payload: { id: number }, done: Function) => {
    try {
        // check if the token has expired

        // const expirationDate = new Date(jwt_payload.exp * 1000);
        // if (expirationDate < new Date()) {
        //     return done(null, false);
        // }

        // passport.authenticate('jwt-admin', { session: false }, (err, user, _info) => {
        //     if (err) return done(err);
        //     if (!user) return done(null, false);
        //     done(null, jwt_payload.id ? jwt_payload : false);
        // });

        const user = await StudentModel.findByPk(jwt_payload.id);
        if (!user) return done(null, false);

        done(null, jwt_payload.id ? jwt_payload : false);
    } catch (error) {
        // logger.error(error);
        done(error);
    }
}));