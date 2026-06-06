using Entities;

namespace EatAndWatch
{
    public static class PatchHelper
    {
        public static void ApplyPatch<T>(T target, object patch)
        {
            var patchProps = patch.GetType().GetProperties();

            foreach (var prop in patchProps)
            {
                var newValue = prop.GetValue(patch);
                if (newValue is null) continue;

                var targetProp = typeof(T).GetProperty(prop.Name);
                if (targetProp == null || !targetProp.CanWrite) continue;

                targetProp.SetValue(target, newValue);
            }
        }

        public static void SyncGenres(Movie movie, List<Genre> newGenres)
        {
            movie.Genres.Clear();
            foreach (var g in newGenres)
                movie.Genres.Add(g);
        }

        public static void SyncTags(Movie movie, List<Tag> newTags)
        {
            movie.Tags.Clear();
            foreach (var t in newTags)
                movie.Tags.Add(t);
        }
    }
}

