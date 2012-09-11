package com.continuuity.data.operation.ttqueue;

import java.io.IOException;
import java.util.Random;

import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.AfterClass;
import org.junit.BeforeClass;

import com.continuuity.api.data.OperationException;
import com.continuuity.common.conf.CConfiguration;
import com.continuuity.data.hbase.HBaseTestBase;
import com.continuuity.data.operation.StatusCode;
import com.continuuity.hbase.ttqueue.HBQConstants;

public class TestNativeHBaseTTQueue extends TestTTQueue {

  private static HTable table;

  @BeforeClass
  public static void startEmbeddedHBase() {
    try {
      HBaseTestBase.startHBase();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private static HTable createTable(byte[] tableName, byte[] family)
      throws IOException {
    HTableDescriptor htd = new HTableDescriptor(tableName);
    HColumnDescriptor hcd = new HColumnDescriptor(family);
    htd.addFamily(hcd);
    HBaseTestBase.getHBaseAdmin().createTable(htd);
    return new HTable(HBaseTestBase.getConfiguration(), tableName);
  }

  @AfterClass
  public static void stopEmbeddedHBase() {
    try {
      HBaseTestBase.stopHBase();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private static final Random r = new Random();

  @Override
  protected TTQueue createQueue(CConfiguration conf) throws OperationException {
    String rand = "" + Math.abs(r.nextInt());
    try {
      table = createTable(Bytes.toBytes("TestNativeHBaseQueueTTQ" + rand),
          HBQConstants.HBQ_FAMILY);
    } catch (IOException e) {
      e.printStackTrace();
      throw new OperationException(StatusCode.HBASE_ERROR, e.getMessage());
    }
    return new TTQueueOnHBaseNative(table,
        Bytes.toBytes("TestTTQueueName" + rand), TestTTQueue.timeOracle, conf);
  }

  @Override
  protected int getNumIterations() {
    return 10;
  }
}
