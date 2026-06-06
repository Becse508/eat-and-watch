using System.Security.Cryptography;
using System.Text;

namespace EatAndWatch
{
    public static class TicketTools
    {
        private static byte[] _secret;
        public static string Secret
        {
            set => _secret = Encoding.UTF8.GetBytes(value);
        }
        private static byte[] CreateHmacBytes(string data)
        {
            using var hmac = new HMACSHA256(_secret);
            return hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        }

        public static string CreateHmac(string data)
        {
            return Convert.ToBase64String(CreateHmacBytes(data));
        }
        public static bool ValidateTicket(int ticketId, string signature)
        {
            var expected = CreateHmacBytes(ticketId.ToString());
            var actual = Convert.FromBase64String(signature);

            return CryptographicOperations.FixedTimeEquals(expected, actual);
        }
    }
}
