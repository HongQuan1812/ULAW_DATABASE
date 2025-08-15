using System;
using System.IO;
using System.Threading;

public class TempFileCleaner : IDisposable
{
    private readonly Timer _timer;
    private readonly string _tmpFolderPath;

    public TempFileCleaner()
    {
        _tmpFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "tmp");
        _timer = new Timer(DeleteOldFiles, null, TimeSpan.Zero, TimeSpan.FromMinutes(15));
    }

    private void DeleteOldFiles(object? state)
    {
        if (!Directory.Exists(_tmpFolderPath)) return;

        var now = DateTime.Now;
        var files = Directory.GetFiles(_tmpFolderPath);

        foreach (var file in files)
        {
            try
            {
                var lastWrite = File.GetLastWriteTime(file);
                if ((now - lastWrite).TotalMinutes > 30)
                {
                    File.Delete(file);
                }
            }
            catch
            {
                // Log lỗi nếu cần
            }
        }
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
