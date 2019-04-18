module.exports = function(req, res, next) {
  if (!req.user) return res.status(403).json({ msg: "denied to access. " });

  if (req.user && !req.user.isAdmin)
    return res
      .status(403)
      .json({ msg: "denied to access. You can't not access." });

  next();
};
