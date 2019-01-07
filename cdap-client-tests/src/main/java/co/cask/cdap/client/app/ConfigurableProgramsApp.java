/*
 * Copyright © 2015-2019 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package co.cask.cdap.client.app;

import co.cask.cdap.api.Config;
import co.cask.cdap.api.app.AbstractApplication;
import co.cask.cdap.api.dataset.lib.KeyValueTable;
import co.cask.cdap.api.service.http.AbstractHttpServiceHandler;
import co.cask.cdap.api.service.http.HttpServiceRequest;
import co.cask.cdap.api.service.http.HttpServiceResponder;
import co.cask.cdap.api.worker.AbstractWorker;
import com.google.common.base.Throwables;
import org.apache.tephra.TransactionFailureException;

import javax.annotation.Nullable;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

/**
 * Test Application that will register different programs based on the config.
 */
public class ConfigurableProgramsApp extends AbstractApplication<ConfigurableProgramsApp.Programs> {

  /**
   * Application Config Class.
   */
  public static class Programs extends Config {
    @Nullable
    private String worker;
    @Nullable
    private String dataset;
    @Nullable
    private String service;

    public Programs() {
      this.dataset = "dutaset";
    }

    public Programs(String worker, String service, String dataset) {
      this.worker = worker;
      this.service = service;
      this.dataset = dataset;
    }
  }

  @Override
  public void configure() {
    Programs config = getConfig();
    if (config.worker != null) {
      addWorker(new Wurker(config.worker, config.dataset));
    }
    if (config.service != null) {
      addService(config.service, new PingHandler());
    }
  }

  /**
   * Test handler
   */
  public static final class PingHandler extends AbstractHttpServiceHandler {

    @GET
    @Path("/ping")
    public void ping(HttpServiceRequest request, HttpServiceResponder responder) {
      responder.sendStatus(200);
    }
  }

  private static class Wurker extends AbstractWorker {

    private final String workerName;
    private final String datasetName;

    Wurker(String workerName, String datasetName) {
      this.workerName = workerName;
      this.datasetName = datasetName;
    }

    @Override
    protected void configure() {
      setName(workerName);
    }

    @Override
    public void run() {
      try {
        getContext().execute(context -> {
          KeyValueTable keyValueTable = context.getDataset(datasetName);
          keyValueTable.write("Samuel", "L. Jackson");
          keyValueTable.write("Dwayne", "Johnson");
        });
      } catch (TransactionFailureException e) {
        throw Throwables.propagate(e);
      }
    }
  }
}
