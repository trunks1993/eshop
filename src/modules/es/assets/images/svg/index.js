/*
 * @Date: 2020-08-12 17:00:01
 * @LastEditTime: 2020-08-12 17:09:17
 */
const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);

const req = require.context("./source", false, /\.svg$/);

requireAll(req);
