// auth.service.ts (snippets)
const access = this.jwt.sign({ sub: user._id }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXP });
const refresh = this.jwt.sign({ sub: user._id }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXP });

// set refresh cookie
res.cookie('refresh', refresh, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*60*60*1000 });
return { accessToken: access, user: safeUser };
